import { Folder, RefreshCw, CheckCircle2, Circle, Globe, Link as LinkIcon, Copy, Settings2, Github, MessageSquare } from "lucide-react";
import { cn } from "../utils";

const AGENTS = [
    { name: "Claude Code", status: "detected", path: "~/.claude" },
    { name: "Cursor", status: "detected", path: "~/Library/Application Support/Cursor" },
    { name: "Codex", status: "detected", path: "~/.codex" },
    { name: "Windsurf", status: "detected", path: "~/.windsurf" },
    { name: "GitHub Copilot", status: "missing", path: "" },
    { name: "TRAE IDE", status: "missing", path: "" },
];

export function Settings() {
    return (
        <div className="max-w-[1000px] mx-auto h-full flex flex-col animate-in fade-in duration-500 pb-12">
            <div className="mb-8 border-b border-[#1C1C1C] pb-6">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Settings2 className="w-6 h-6 text-indigo-400" />
                    设置
                </h1>
            </div>

            <div className="space-y-10">

                {/* Agent Status */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-zinc-200">支持的 Agent (12/15)</h2>
                        <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                            <RefreshCw className="w-4 h-4" />
                            重新检测
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {AGENTS.map((agent, i) => (
                            <div key={i} className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-colors",
                                agent.status === 'detected'
                                    ? "bg-[#121212] border-[#2A2A2A] hover:border-[#3A3A3A]"
                                    : "bg-[#0A0A0A] border-[#1C1C1C] opacity-60 grayscale"
                            )}>
                                <div className="flex items-center gap-3">
                                    {agent.status === 'detected' ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-zinc-600" />
                                    )}
                                    <div>
                                        <h3 className={cn("text-sm font-medium", agent.status === 'detected' ? "text-zinc-200" : "text-zinc-500")}>
                                            {agent.name}
                                        </h3>
                                        <p className="text-[10px] text-zinc-600 truncate max-w-[120px]" title={agent.path}>
                                            {agent.path || "未安装"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Global Settings */}
                <section>
                    <h2 className="text-lg font-semibold text-zinc-200 mb-4">全局配置</h2>
                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden divide-y divide-[#1C1C1C]">

                        {/* Repository Path */}
                        <div className="p-5 flex items-start justify-between">
                            <div>
                                <h3 className="text-zinc-200 font-medium mb-1">中央仓库路径</h3>
                                <p className="text-zinc-500 text-sm mb-3">所有 Skills 和场景配置的默认存储位置。</p>
                                <div className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 w-fit group cursor-pointer hover:border-indigo-500/50 transition-colors">
                                    <Folder className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                    <span className="text-sm font-mono text-zinc-300">~/.skills-manager/</span>
                                </div>
                            </div>
                            <button className="text-sm px-3 py-1.5 border border-[#2A2A2A] rounded-md text-zinc-300 hover:bg-[#1A1A1A] transition-colors">
                                更改目录
                            </button>
                        </div>

                        {/* Sync Mode */}
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-zinc-200 font-medium mb-1">默认同步模式</h3>
                                <p className="text-zinc-500 text-sm">推荐使用符号链接，占用空间极小且修改可实时生效。</p>
                            </div>
                            <div className="flex bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-1">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-[#252528] text-zinc-200 shadow-sm transition-colors">
                                    <LinkIcon className="w-4 h-4" /> 符号链接
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
                                    <Copy className="w-4 h-4" /> 文件复制
                                </button>
                            </div>
                        </div>

                        {/* Default Scenario */}
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-zinc-200 font-medium mb-1">默认启动场景</h3>
                                <p className="text-zinc-500 text-sm">应用启动时自动加载的场景。</p>
                            </div>
                            <select className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50">
                                <option>工作</option>
                                <option>个人学习</option>
                                <option>开源项目</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-zinc-200 font-medium mb-1">语言 (Language)</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-zinc-500" />
                                <select className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50">
                                    <option>简体中文 (zh-CN)</option>
                                    <option>English (en-US)</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </section>

                {/* About */}
                <section>
                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                            <Settings2 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Skills Manager 2.2</h3>
                        <p className="text-zinc-500 text-sm mb-6">Built for macOS. 极简、高效、无感多场景切换。</p>

                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1C1C] hover:bg-[#252528] text-zinc-300 text-sm font-medium transition-colors border border-[#2A2A2A]">
                                <Github className="w-4 h-4" /> GitHub
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1C1C] hover:bg-[#252528] text-zinc-300 text-sm font-medium transition-colors border border-[#2A2A2A]">
                                <MessageSquare className="w-4 h-4" /> 反馈建议
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
