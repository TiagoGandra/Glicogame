import type { TabId } from "@/app/lib/types";
import { TABS } from "@/app/lib/constants";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="tab-nav px-2 pb-[env(safe-area-inset-bottom,8px)]" id="main-nav">
      <div className="flex justify-around">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button flex-1 ${activeTab === tab.id ? "active" : ""}`}
            id={`tab-${tab.id}`}
            aria-label={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
