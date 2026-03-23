import React from 'react';
import { Activity, Settings, HelpCircle, User, Bell, Clock, ShieldAlert, Cpu, FileWarning, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Badge } from '@/shared/components/ui/badge';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/common/ThemeToggle';
import { cn } from '@/shared/lib/utils';

export function Navbar() {

  const [notifications, setNotifications] = React.useState<any[]>([
    { id: 1, title: 'ACL Integrity Risk', desc: 'Frequent configuration changes or physical config issue events identified. Review ACL list consistency.', time: 'Just Now', icon: ShieldAlert, color: 'text-orange-400', read: false },
    { id: 2, title: 'Metric-Silent Anomaly', desc: 'Multiple alarms raised across 8 devices without corresponding metric spikes. Investigate correlation source.', time: '5m ago', icon: Activity, color: 'text-red-400', read: false },
    { id: 3, title: 'Predictive Flap Warning', desc: 'Topology Analysis: 12 identified devices are in danger of imminent interface flapping.', time: '15m ago', icon: Zap, color: 'text-blue-400', read: false },
    { id: 4, title: 'Global Config Drift', desc: 'Infrastructure Baseline: 24 devices reported with critical configuration drift from template.', time: '1h ago', icon: Clock, color: 'text-purple-400', read: false },
    { id: 5, title: 'High CPU Utilization', desc: 'Cross-layer alert: 5 devices are seen frequent high cpu util.', time: '2h ago', icon: Cpu, color: 'text-emerald-400', read: false }
  ]);
  const [isNotiOpen, setIsNotiOpen] = React.useState(false);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* NOTIFICATION SIDEBAR */}
        {isNotiOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-all" onClick={() => setIsNotiOpen(false)} />
            <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0F172A] border-l border-white/5 z-[101] shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Notifications</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsNotiOpen(false)} className="text-slate-500 hover:text-white">✕</Button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Unread Strategic Alerts</h3>
                  {notifications.filter(n => !n.read).map(n => (
                    <div key={n.id} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/20 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-lg bg-white/5", n.color)}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-black text-white uppercase tracking-wider">{n.title}</span>
                            <span className="text-[9px] font-bold text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{n.desc}</p>
                          <div className="mt-4">
                            <Button 
                              onClick={() => markAsRead(n.id)}
                              className="h-7 px-4 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-900/40"
                            >
                              Mark as Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.filter(n => !n.read).length === 0 && (
                    <div className="py-12 text-center">
                      <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-4 opacity-50" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active system alerts</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">Processed History</h3>
                  {notifications.filter(n => n.read).map(n => (
                    <div key={n.id} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 opacity-60">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white/5 text-slate-500">
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{n.title}</span>
                            <span className="text-[9px] font-bold text-slate-600">Processed</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 p-1">
            <img src="/infraon_logo.jpg" alt="Infraon Logo" className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-screen" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">Event Analytics</span>
            <span className="text-xs text-muted-foreground">Intelligent RCA Platform</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button 
            onClick={() => setIsNotiOpen(true)}
            variant="ghost" 
            size="icon" 
            className="relative"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-severity-critical">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/docs">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground hidden md:inline">Operator</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
