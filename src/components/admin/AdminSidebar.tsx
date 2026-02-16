import { useState } from 'react';
import { Shield, Lightbulb, BookOpen, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type AdminSection = 'rules' | 'intents' | 'kb' | 'auto-remediation';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  { id: 'rules' as AdminSection, label: 'Rules', icon: Shield },
  { id: 'intents' as AdminSection, label: 'Intents & Hypothesis', icon: Lightbulb },
  { id: 'kb' as AdminSection, label: 'Knowledge Base', icon: BookOpen },
  { id: 'auto-remediation' as AdminSection, label: 'Auto Remediation', icon: Zap },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-full bg-card/50 border-r border-border/50 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-4 border-b border-border/50 flex items-center justify-between overflow-hidden",
        isCollapsed ? "justify-center" : "px-4"
      )}>
        {!isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">Admin Settings</h2>
            <p className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">Manage rules & intents</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", isCollapsed ? "rotate-0" : "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
              {!isCollapsed && (
                <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis animate-in fade-in slide-in-from-left-1 duration-200">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
