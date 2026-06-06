use crate::core::{
    central_repo, error::AppError, git_backup, git_fetcher, skill_metadata, sync_metadata,
};
use std::sync::{Arc, LazyLock};
use tauri::State;
use tokio::sync::{watch, Mutex};
use walkdir::WalkDir;

use crate::core::skill_store::SkillStore;

static FETCH_IN_FLIGHT: LazyLock<Mutex<Option<FetchInFlight>>> = LazyLock::new(|| Mutex::new(None));

#[derive(Clone)]
struct FetchInFlight {
    completion: watch::Receiver<Option<Result<(), AppError>>>,
}

async fn wait_for_fetch(
    mut completion: watch::Receiver<Option<Result<(), AppError>>>,
) -> Result<(), AppError> {
    loop {
        if let Some(result) = completion.borrow().clone() {
            return result;
        }
        if completion.changed().await.is_err() {
            return Err(AppError::internal(
                "git fetch task ended without reporting a result",
            ));
        }
    }
}

#[tauri::command]
pub async fn git_backup_fetch(store: State<'_, Arc<SkillStore>>) -> Result<(), AppError> {
    let _ = store;
    let completion = {
        let mut in_flight = FETCH_IN_FLIGHT.lock().await;
        if let Some(fetch) = in_flight.as_ref() {
            fetch.completion.clone()
        } else {
            let (tx, completion) = watch::channel(None);
            *in_flight = Some(FetchInFlight {
                completion: completion.clone(),
            });
            let skills_dir = central_repo::skills_dir();
            tokio::spawn(async move {
                let result = match tokio::task::spawn_blocking(move || {
                    git_backup::fetch_remote(&skills_dir).map_err(AppError::git)
                })
                .await
                {
                    Ok(result) => result,
                    Err(error) => Err(AppError::from(error)),
                };

                let _ = tx.send(Some(result));
                let mut in_flight = FETCH_IN_FLIGHT.lock().await;
                *in_flight = None;
            });
            completion
        }
    };
    wait_for_fetch(completion).await
}

#[tauri::command]
pub async fn git_backup_status(
    store: State<'_, Arc<SkillStore>>,
) -> Result<git_backup::GitBackupStatus, AppError> {
    let _ = store; // ensure DB is available
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || git_backup::get_status(&skills_dir).map_err(AppError::git))
        .await?
}

#[tauri::command]
pub async fn git_backup_init(store: State<'_, Arc<SkillStore>>) -> Result<(), AppError> {
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git init", || {
            sync_metadata::write_all_from_db_unlocked(&store)?;
            git_backup::init_repo_unlocked(&skills_dir)
        })
        .map_err(AppError::git)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_set_remote(
    store: State<'_, Arc<SkillStore>>,
    url: String,
) -> Result<(), AppError> {
    let _ = store;
    git_fetcher::validate_git_url(&url).map_err(AppError::git)?;
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::set_remote(&skills_dir, &url).map_err(AppError::classify_git_error)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_commit(
    store: State<'_, Arc<SkillStore>>,
    message: String,
) -> Result<(), AppError> {
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git commit", || {
            sync_metadata::write_all_from_db_unlocked(&store)?;
            git_backup::commit_all_unlocked(&skills_dir, &message)
        })
        .map_err(AppError::git)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_push(store: State<'_, Arc<SkillStore>>) -> Result<(), AppError> {
    let _ = store;
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::push(&skills_dir).map_err(AppError::classify_git_error)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_pull(store: State<'_, Arc<SkillStore>>) -> Result<(), AppError> {
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git pull", || {
            git_backup::pull_unlocked(&skills_dir)?;
            reconcile_skills_index_unlocked(&store)
        })
        .map_err(AppError::classify_git_error)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_clone(
    store: State<'_, Arc<SkillStore>>,
    url: String,
) -> Result<(), AppError> {
    git_fetcher::validate_git_url(&url).map_err(AppError::git)?;
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git clone", || {
            git_backup::clone_into_unlocked(&skills_dir, &url)?;
            reconcile_skills_index_unlocked(&store)
        })
        .map_err(AppError::classify_git_error)
    })
    .await?
}

/// Recovery: discard the local `.git` and re-clone from the configured remote.
/// Existing skill files are preserved via the same backup-then-merge flow
/// used by the regular clone path.
#[tauri::command]
pub async fn git_backup_reclone(
    store: State<'_, Arc<SkillStore>>,
    url: String,
) -> Result<(), AppError> {
    git_fetcher::validate_git_url(&url).map_err(AppError::git)?;
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git reclone", || {
            git_backup::reclone_from_remote_unlocked(&skills_dir, &url)?;
            reconcile_skills_index_unlocked(&store)
        })
        .map_err(AppError::classify_git_error)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_create_snapshot(
    store: State<'_, Arc<SkillStore>>,
) -> Result<String, AppError> {
    let _ = store;
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::create_snapshot_tag(&skills_dir).map_err(AppError::git)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_list_versions(
    store: State<'_, Arc<SkillStore>>,
    limit: Option<u32>,
) -> Result<Vec<git_backup::GitBackupVersion>, AppError> {
    let _ = store;
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::list_snapshot_versions(&skills_dir, limit.map(|v| v as usize))
            .map_err(AppError::git)
    })
    .await?
}

#[tauri::command]
pub async fn git_backup_restore_version(
    store: State<'_, Arc<SkillStore>>,
    tag: String,
) -> Result<(), AppError> {
    let store = store.inner().clone();
    let skills_dir = central_repo::skills_dir();
    tokio::task::spawn_blocking(move || {
        git_backup::with_repo_lock("git restore snapshot", || {
            git_backup::restore_snapshot_version_unlocked(&skills_dir, &tag)?;
            reconcile_skills_index_unlocked(&store)
        })
        .map_err(AppError::git)?;
        Ok(())
    })
    .await?
}

fn reconcile_skills_index_unlocked(store: &SkillStore) -> anyhow::Result<()> {
    sync_metadata::cleanup_temporary_files()?;
    if sync_metadata::has_complete_skill_snapshot() {
        sync_metadata::reindex_from_metadata_unlocked(store)?;
        return Ok(());
    }

    let skills_dir = central_repo::skills_dir();
    std::fs::create_dir_all(&skills_dir)?;

    // Remove stale DB records whose central directories no longer exist.
    let existing = store.get_all_skills()?;
    for skill in existing {
        if !std::path::Path::new(&skill.central_path).exists() {
            store.delete_skill(&skill.id)?;
        }
    }

    // Add missing DB records for directories present in central repo.
    for entry in WalkDir::new(&skills_dir)
        .min_depth(1)
        .max_depth(6)
        .into_iter()
        .filter_entry(|e| e.file_name().to_string_lossy() != ".git")
        .flatten()
    {
        let path = entry.path().to_path_buf();
        if !entry.file_type().is_dir() || !skill_metadata::is_valid_skill_dir(&path) {
            continue;
        }

        let central_path = path.to_string_lossy().to_string();
        if store.get_skill_by_central_path(&central_path)?.is_some() {
            continue;
        }

        let meta = crate::core::skill_metadata::parse_skill_md(&path);
        let inferred_name = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "unknown-skill".to_string());
        let name = meta
            .name
            .filter(|s| !s.trim().is_empty())
            .unwrap_or(inferred_name);
        let now = chrono::Utc::now().timestamp_millis();

        let record = crate::core::skill_store::SkillRecord {
            id: uuid::Uuid::new_v4().to_string(),
            name,
            description: meta.description,
            source_type: "import".to_string(),
            source_ref: Some(central_path.clone()),
            source_ref_resolved: None,
            source_subpath: None,
            source_branch: None,
            source_revision: None,
            remote_revision: None,
            central_path,
            content_hash: crate::core::content_hash::hash_directory(&path).ok(),
            enabled: true,
            created_at: now,
            updated_at: now,
            status: "ok".to_string(),
            update_status: "local_only".to_string(),
            last_checked_at: Some(now),
            last_check_error: None,
        };

        store.insert_skill(&record)?;
    }

    sync_metadata::write_all_from_db_unlocked(store)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn wait_for_fetch_returns_shared_success_to_waiters() {
        let (tx, rx) = watch::channel(None);
        let first = tokio::spawn(wait_for_fetch(rx.clone()));
        let second = tokio::spawn(wait_for_fetch(rx));

        tx.send(Some(Ok(()))).unwrap();

        first.await.unwrap().unwrap();
        second.await.unwrap().unwrap();
    }

    #[tokio::test]
    async fn wait_for_fetch_returns_shared_error_to_waiters() {
        let (tx, rx) = watch::channel(None);
        let first = tokio::spawn(wait_for_fetch(rx.clone()));
        let second = tokio::spawn(wait_for_fetch(rx));

        tx.send(Some(Err(AppError::git("fetch failed")))).unwrap();

        let first_error = first.await.unwrap().unwrap_err();
        let second_error = second.await.unwrap().unwrap_err();
        assert_eq!(first_error.kind, crate::core::error::ErrorKind::Git);
        assert_eq!(first_error.message, "fetch failed");
        assert_eq!(second_error.kind, crate::core::error::ErrorKind::Git);
        assert_eq!(second_error.message, "fetch failed");
    }
}
