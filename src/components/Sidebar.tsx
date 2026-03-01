import { Link, useLocation } from "react-router-dom";
import { Hammer, LayoutDashboard, Layers, Download, Settings, Plus, Folder, ChevronRight, Hash } from "lucide-react";
import { cn } from "../utils";

const NAV_ITEMS = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "我的 Skills", path: "/my-skills", icon: Layers },
    { name: "安装 Skills", path: "/install", icon: Download },
];

const SCENARIOS = [
    { name: "工作", count: 34 },
    { name: "个人学习" },
    { name: "开源项目" },
    { name: "旅行笔记" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-[240px] flex-shrink-0 bg-[#0F0F0F] border-r border-[#1C1C1C] h-full flex flex-col select-none relative z-10">
            {/* Native-like macOS window inset for traffic lights */}
            <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as any} />

            <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-6 text-zinc-300 font-semibold text-sm">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Hammer className="w-3.5 h-3.5 text-white" />
                    </div>
                    Skills Manager
                </div>

                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors outline-none",
                                    isActive
                                        ? "bg-[#252528] text-white"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1A1A1A]"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-zinc-500")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 py-3 flex-1 overflow-y-auto scrollbar-hide">
                <div className="text-[11px] font-semibold text-zinc-500 mb-2 px-2.5 tracking-wider">场景</div>
                <div className="space-y-[2px]">
                    {SCENARIOS.map((scenario) => {
                        const isActive = scenario.name === "工作";
                        return (
                            <button
                                key={scenario.name}
                                className={cn(
                                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-left transition-colors group outline-none",
                                    isActive
                                        ? "bg-[#252528] text-white font-medium"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1A1A1A]"
                                )}
                            >
                                <Hash className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                                <span className="flex-1 truncate">{scenario.name}</span>
                                {scenario.count !== undefined && (
                                    <span className={cn(
                                        "text-[10px] px-1.5 rounded-full",
                                        isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-[#1C1C1C] text-zinc-500 group-hover:bg-[#252528]"
                                    )}>
                                        {scenario.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button className="flex items-center gap-2 px-2.5 py-1.5 mt-2 rounded-md text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1A] transition-colors w-full outline-none">
                    <Plus className="w-3.5 h-3.5" />
                    新建场景
                </button>
            </div>

            <div className="p-4 mt-auto">
                <Link
                    to="/settings"
                    className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors outline-none",
                        location.pathname === "/settings"
                            ? "bg-[#252528] text-white"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1A1A1A]"
                    )}
                >
                    <Settings className={cn("w-4 h-4", location.pathname === "/settings" ? "text-indigo-400" : "text-zinc-500")} />
                    设置
                </Link>
            </div>
        </div>
    );
}
