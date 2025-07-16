interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1 rounded-2xl bg-white p-1 dark:border-gray-700/60 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab("recent")}
          className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
            activeTab === "recent" ? "bg-primary text-foreground shadow-sm" : "text-slate-600 hover:text-foreground"
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab("forums")}
          className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
            activeTab === "forums"
              ? "bg-primary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Communities
        </button>
      </div>
    </div>
  );
}
