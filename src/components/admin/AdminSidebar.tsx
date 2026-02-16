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
  return (
    <div className="w-64 h-full bg-card/50 border-r border-border/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Admin Settings</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage rules, intents & remediation</p>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className={cn(
                'h-4 w-4 transition-transform',
                isActive && 'rotate-90'
              )} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
