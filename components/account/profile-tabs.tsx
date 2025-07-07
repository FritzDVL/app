interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1 rounded-2xl bg-slate-100/80 p-1">
        <button
          onClick={() => setActiveTab("recent")}
          className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
            activeTab === "recent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab("forums")}
          className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
            activeTab === "forums" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Communities
        </button>
      </div>
    </div>
  );
}
