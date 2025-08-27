interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1 rounded-xl bg-white p-1 shadow-sm dark:border-gray-700/60 dark:bg-gray-800 sm:rounded-2xl">
        <button
          onClick={() => setActiveTab("recent")}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm ${
            activeTab === "recent" ? "bg-primary text-foreground shadow-sm" : "text-slate-600 hover:text-foreground"
          }`}
        >
          <span className="sm:hidden">Recent Activity</span>
          <span className="hidden sm:inline">Recent Activity</span>
        </button>
        <button
          onClick={() => setActiveTab("forums")}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm ${
            activeTab === "forums"
              ? "bg-primary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="sm:hidden">Communities</span>
          <span className="hidden sm:inline">Communities</span>
        </button>
      </div>
    </div>
  );
}
