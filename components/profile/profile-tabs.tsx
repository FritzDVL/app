interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "activity", label: "Activity" },
    { id: "badges", label: "Badges" },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-slate-200 px-4 dark:border-gray-800 sm:px-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-brand-500 text-slate-900 dark:text-white"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
