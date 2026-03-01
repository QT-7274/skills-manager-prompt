import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-zinc-200">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-[800px] overflow-hidden relative">
                <Topbar />

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative z-0 p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
