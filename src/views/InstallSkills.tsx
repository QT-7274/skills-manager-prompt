import { useState } from "react";
import { Search, DownloadCloud, UploadCloud, Github, Box, Star, TrendingUp, Clock, Plus, FolderUp } from "lucide-react";
import { cn } from "../utils";

const MARKET_SKILLS = [
    { id: 1, name: "Code Review Assistant", author: "anthropic", installs: "125k", desc: "Expert code reviewer focusing on performance and security." },
    { id: 2, name: "React Component Generator", author: "vercel", installs: "89k", desc: "Generates beautiful React components using Tailwind CSS." },
    { id: 3, name: "Git Commit Helper", author: "github", installs: "210k", desc: "Formats commit messages according to conventional commits." },
    { id: 4, name: "SQL Query Optimizer", author: "supabase", installs: "45k", desc: "Analyzes and optimizes complex SQL queries." },
    { id: 5, name: "Docker Config Writer", author: "docker", installs: "156k", desc: "Creates optimized Dockerfiles and compose setups." },
    { id: 6, name: "TypeScript Type Genie", author: "microsoft", installs: "302k", desc: "Advanced TypeScript type definitions and generics." },
];

export function InstallSkills() {
    const [activeTab, setActiveTab] = useState<'market' | 'local' | 'git'>('market');
    const [marketTab, setMarketTab] = useState<'hot' | 'trending' | 'all'>('hot');

    return (
        <div className="max-w-[1200px] mx-auto h-full flex flex-col animate-in fade-in duration-500">

            {/* Header and Main Tabs */}
            <div className="mb-8 border-b border-[#1C1C1C]">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-6">安装 Skills</h1>
                <div className="flex gap-8">
                    {[
                        { id: 'market', label: '浏览市场', icon: Box },
                        { id: 'local', label: '本地安装', icon: UploadCloud },
                        { id: 'git', label: 'Git 安装', icon: Github },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "pb-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors outline-none",
                                    isActive
                                        ? "border-indigo-500 text-indigo-400"
                                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab Content: Market */}
            {activeTab === 'market' && (
                <div className="flex-1 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex bg-[#121212] border border-[#2A2A2A] rounded-lg p-1">
                            {[
                                { id: 'hot', label: '热门', icon: Star },
                                { id: 'trending', label: '趋势', icon: TrendingUp },
                                { id: 'all', label: '全部', icon: Clock },
                            ].map(tab => {
                                const Icon = tab.icon;
                                const isActive = marketTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setMarketTab(tab.id as any)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors outline-none",
                                            isActive ? "bg-[#252528] text-zinc-200 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="搜索 skills.sh 市场..."
                                className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-zinc-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
                        {MARKET_SKILLS.map(skill => (
                            <div key={skill.id} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#3A3A3A] transition-colors group flex flex-col h-[200px]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-zinc-200 text-base">{skill.name}</h3>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded">@{skill.author}</span>
                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                        <DownloadCloud className="w-3.5 h-3.5" /> {skill.installs}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500 line-clamp-2 mb-auto">
                                    {skill.desc}
                                </p>
                                <div className="pt-4 flex justify-end">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-sm w-full justify-center group-hover:shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                                        <Plus className="w-4 h-4" />
                                        一键安装
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Content: Local */}
            {activeTab === 'local' && (
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-300 pb-20">
                    <div className="w-full max-w-2xl bg-[#121212] border-2 border-dashed border-[#2A2A2A] rounded-2xl p-16 flex flex-col items-center justify-center text-center hover:bg-[#151515] hover:border-indigo-500/50 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all">
                            <FolderUp className="w-8 h-8 text-zinc-500 group-hover:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-200 mb-2">拖拽 Skills 文件夹到此处</h3>
                        <p className="text-zinc-500 mb-8 max-w-sm">
                            支持包含 SKILL.md 的文件夹、.zip 压缩包或单体 .skill 文件。
                        </p>
                        <button className="px-6 py-2.5 rounded-lg bg-[#252528] hover:bg-[#2A2A2E] border border-[#3A3A3A] text-zinc-200 text-sm font-medium transition-colors">
                            选择本地文件...
                        </button>
                    </div>
                </div>
            )}

            {/* Tab Content: Git */}
            {activeTab === 'git' && (
                <div className="flex-1 animate-in fade-in duration-300">
                    <div className="max-w-xl bg-[#121212] border border-[#2A2A2A] rounded-xl p-8">
                        <div className="mb-6 flex items-center justify-center w-12 h-12 bg-[#1C1C1C] rounded-lg border border-[#2A2A2A]">
                            <Github className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">从 Git 仓库安装</h2>
                        <p className="text-zinc-500 text-sm mb-6">
                            输入公共或私有 Git 仓库地址。私有仓库请确保本地已配置对应的 SSH 密钥组合。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">仓库地址</label>
                                <input
                                    type="text"
                                    placeholder="https://github.com/user/repo.git 或 git@github.com..."
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-zinc-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                                    自定义名称
                                    <span className="text-xs text-zinc-600 font-normal">可选</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="留空则使用仓库名称"
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-zinc-600"
                                />
                            </div>

                            <div className="pt-4">
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors w-full shadow-[0_0_15px_rgba(79,70,229,0.2)] border border-indigo-500">
                                    <DownloadCloud className="w-4 h-4" />
                                    安装并克隆
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
