import { Search, Filter, LayoutGrid, List, FileText, CheckCircle2, Circle, MoreHorizontal, Github, HardDrive, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

const MOCK_SKILLS = [
    { id: 1, name: "React Expert", desc: "React hooks, performance optimization and patterns.", source: "skills.sh", synced: true, agents: ["claude", "cursor", "codex"] },
    { id: 2, name: "Go Microservices", desc: "Best practices for writing robust Go microservices.", source: "Git", synced: true, agents: ["cursor", "copilot"] },
    { id: 3, name: "UI/UX Reviewer", desc: "Critiques UI code against modern design principles.", source: "本地", synced: false, agents: [] },
    { id: 4, name: "Python Scripts", desc: "Common utility scripts for data processing.", source: "Git", synced: true, agents: ["claude"] },
    { id: 5, name: "Docker Wizard", desc: "Helps writing optimized Dockerfiles and compose files.", source: "skills.sh", synced: true, agents: ["claude", "windsurf", "cursor"] },
    { id: 6, name: "AWS Architect", desc: "Infrastructure as software definitions.", source: "本地", synced: false, agents: [] },
];

export function MySkills() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="max-w-[1200px] mx-auto h-full flex flex-col animate-in fade-in duration-500">
            {/* Top Actions */}
            <div className="flex items-center justify-between mb-8 pr-2">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    工作场景 Skills
                    <span className="text-sm font-medium bg-[#1C1C1C] text-zinc-400 px-2.5 py-1 rounded-full border border-[#2A2A2A]">{MOCK_SKILLS.length}</span>
                </h1>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    查看全部 Skills (跨场景) &rarr;
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex gap-3 flex-1">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="在当前场景中搜索..."
                            className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium placeholder-zinc-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-[#121212] border border-[#2A2A2A] rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-[#1A1A1A] transition-colors outline-none font-medium">
                        <Filter className="w-4 h-4 text-zinc-400" />
                        全部状态
                    </button>
                </div>

                <div className="flex bg-[#121212] border border-[#2A2A2A] rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn("p-1.5 rounded-md transition-colors outline-none", viewMode === 'grid' ? "bg-[#252528] text-zinc-200 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn("p-1.5 rounded-md transition-colors outline-none", viewMode === 'list' ? "bg-[#252528] text-zinc-200 shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Skills Grid */}
            <div className={cn(
                "pb-12",
                viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"
            )}>
                {MOCK_SKILLS.map(skill => (
                    <div key={skill.id} className={cn(
                        "bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-[#3A3A3A] transition-colors group flex",
                        viewMode === 'grid' ? "flex-col h-[200px]" : "items-center px-6 py-4"
                    )}>

                        <div className={cn("flex-1", viewMode === 'grid' ? "p-5" : "flex items-center gap-6")}>

                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-zinc-200 text-base">{skill.name}</h3>
                                    {skill.synced ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-zinc-600" />
                                    )}
                                </div>
                                {viewMode === 'grid' && (
                                    <button className="text-zinc-500 hover:text-zinc-300 focus:outline-none">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <p className={cn(
                                "text-sm text-zinc-500 line-clamp-2",
                                viewMode === 'list' && "flex-1 mb-0"
                            )}>
                                {skill.desc}
                            </p>

                            {viewMode === 'list' && (
                                <div className="flex gap-4 items-center w-64 justify-end">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-[#1C1C1C] px-2 py-1 rounded border border-[#2A2A2A]">
                                        {skill.source === 'Git' && <Github className="w-3 h-3" />}
                                        {skill.source === '本地' && <HardDrive className="w-3 h-3" />}
                                        {skill.source === 'skills.sh' && <Globe className="w-3 h-3" />}
                                        {skill.source}
                                    </div>
                                    <button className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-medium transition-colors border",
                                        skill.synced
                                            ? "bg-[#1C1C1C] border-[#2A2A2A] text-zinc-300 hover:bg-[#252528] hover:text-red-400 hover:border-red-500/30"
                                            : "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20"
                                    )}>
                                        {skill.synced ? "取消同步" : "一键同步"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {viewMode === 'grid' && (
                            <div className="px-5 py-3.5 border-t border-[#1C1C1C] bg-[#0A0A0A]/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium cursor-help" title={`Source: ${skill.source}`}>
                                        {skill.source === 'Git' && <Github className="w-3.5 h-3.5" />}
                                        {skill.source === '本地' && <HardDrive className="w-3.5 h-3.5" />}
                                        {skill.source === 'skills.sh' && <Globe className="w-3.5 h-3.5" />}
                                        {skill.source}
                                    </div>
                                    {skill.agents.length > 0 && (
                                        <div className="flex -space-x-1.5">
                                            {skill.agents.slice(0, 3).map((a, i) => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center text-[8px] font-bold text-zinc-400" title={`Synced to ${a}`}>
                                                    {a[0].toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-[#1C1C1C] rounded transition-colors" title="View Documentation">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button className={cn(
                                        "px-3 py-1 rounded-md text-xs font-medium transition-colors border outline-none",
                                        skill.synced
                                            ? "bg-[#1C1C1C] border-[#2A2A2A] text-zinc-300 hover:bg-[#252528]"
                                            : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
                                    )}>
                                        {skill.synced ? "已同步" : "同步"}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
