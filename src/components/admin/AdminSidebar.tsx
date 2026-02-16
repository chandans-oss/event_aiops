import { useState } from 'react';
import { Shield, Lightbulb, BookOpen, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
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
      "h-full bg-card/40 backdrop-blur-md border-r border-border/50 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with Collapse Toggle */}
      <div className={cn(
        "p-4 border-b border-border/50 flex items-center justify-between",
        isCollapsed ? "justify-center" : "justify-end"
      )}>
        {!isCollapsed && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold animate-in fade-in duration-500">
            Admin Workspace
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive && "text-primary scale-110"
              )} />
              {!isCollapsed && (
                <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              {!isCollapsed && isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info (Only when expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/30 bg-secondary/5">
          <p className="text-[9px] text-muted-foreground leading-tight uppercase tracking-tighter opacity-50">
            System Configuration Mode
          </p>
        </div>
      )}
    </div>
  );
}
