import type { TabId } from "@/app/lib/types";
import { TABS } from "@/app/lib/constants";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  variant?: "bottom" | "horizontal";
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  variant = "bottom",
}: TabNavigationProps) {
  if (variant === "horizontal") {
    return (
      <nav
        className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card/60 backdrop-blur-md"
        id="main-nav-desktop"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            id={`tab-desktop-${tab.id}`}
            aria-label={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    );
  }

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
