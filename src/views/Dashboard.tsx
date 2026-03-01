import { Layers, CheckCircle2, Bot, Plus, Download, ChevronRight, Hash } from "lucide-react";

export function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">你好，xingkong！</h1>
                <p className="text-zinc-400">当前场景：<span className="text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded ml-1">工作</span> (已启用 34 个 Skills)</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { title: "当前场景 Skills", value: "34", icon: Layers, color: "text-blue-400", bg: "from-blue-500/10 to-transparent" },
                    { title: "已同步", value: "32", icon: CheckCircle2, color: "text-emerald-400", bg: "from-emerald-500/10 to-transparent" },
                    { title: "支持 Agent", value: "12/15", icon: Bot, color: "text-purple-400", bg: "from-purple-500/10 to-transparent" },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className={`relative overflow-hidden p-6 rounded-2xl bg-[#121212] border border-[#2A2A2A] shadow-sm transform hover:-translate-y-1 transition-transform group`}>
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bg} -mr-8 -mt-8 rounded-full opacity-50 transition-opacity group-hover:opacity-100`}></div>
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="text-zinc-500 text-sm font-medium mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-semibold text-zinc-100">{stat.value}</h3>
                                </div>
                                <div className={`p-2 bg-[#1C1C1C] rounded-lg ${stat.color} border border-[#2A2A2A]`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-indigo-500 group outline-none">
                    <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    扫描本地 Skills 导入
                </button>
                <button className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252528] text-white font-medium transition-colors border border-[#2A2A2A] group outline-none">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    安装新 Skills 到当前场景
                </button>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-base font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                    近期动态
                </h2>
                <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden divide-y divide-[#1C1C1C]">
                    {[
                        { name: "Code Review Assistant", source: "Git", status: "已同步到 Claude Code", time: "10 分钟前" },
                        { name: "React Components Generator", source: "本地", status: "已同步到 Cursor, Codex", time: "1 小时前" },
                        { name: "Git Commit Helper", source: "skills.sh", status: "已同步到所有 12 个 Agent", time: "昨天" },
                        { name: "SQL Query Optimizer", source: "本地", status: "从当前场景移除", time: "2 天前", isRemove: true },
                        { name: "Docker Config Writer", source: "Git", status: "已同步到 Windsurf", time: "上周" },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-[#151515] transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  ${activity.isRemove ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-400"}`}>
                                    {activity.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-zinc-200 text-sm font-medium mb-0.5 flex items-center gap-2">
                                        {activity.name}
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C1C1C] text-zinc-400 border border-[#2A2A2A] font-normal tracking-wide">
                                            {activity.source}
                                        </span>
                                    </h4>
                                    <p className="text-zinc-500 text-xs">{activity.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-zinc-600 text-xs">{activity.time}</span>
                                <button className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-400">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
