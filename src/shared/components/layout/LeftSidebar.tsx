import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Upload,
  PlayCircle,
  Workflow,
  BarChart3,
  FileInput,
  GitBranch,
  Search,
  Wrench,
  FolderArchive,
  Network,
  TrendingUp,
  Bot,
  Target,
  List,
  BrainCircuit,
  Heart,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { path: "/", label: "Overview", icon: LayoutDashboard },
      { path: "/dashboard/prediction", label: "Prediction Dashboard", icon: Activity },
      { path: "/dashboard/alarm-prediction", label: "Alarm Prediction", icon: TrendingUp },
      { path: "/dashboard/roi", label: "ROI Dashboard", icon: Target },
    ]
  },
  {
    path: "/events",
    label: "Events",
    icon: Activity,
    children: [
      { path: "/events", label: "Event List", icon: List },
      { path: "/events/predicted", label: "Prediction", icon: TrendingUp },
      { path: "/clustering", label: "Anomaly Detection", icon: GitBranch },
      { path: "/correlation", label: "Pattern Detection", icon: BrainCircuit },
    ]
  },
  { path: "/topology", label: "Topology", icon: Network },
  {
    path: "/algo-training",
    label: "Algo Training",
    icon: Workflow,
    children: [
      { path: "/algo-training/config", label: "Training Configuration", icon: Settings },
      { path: "/algo-training/training", label: "Training", icon: PlayCircle },
      { path: "/algo-training/results", label: "Results", icon: BarChart3 },
    ]
  },
  {
    path: "/admin",
    label: "Admin",
    icon: Settings,
    children: [
      { path: "/admin", label: "Configuration", icon: Settings },
      { path: "/admin/ai-explainability", label: "ML Explainability", icon: BrainCircuit },
      { path: "/admin/upload", label: "Upload Data", icon: Upload },
    ]
  },
  { path: "/agents", label: "Agents", icon: Bot },
  {
    path: "/pattern-prediction",
    label: "Pattern & Prediction",
    icon: TrendingUp,
    children: [
      { path: "/pattern-prediction/pattern", label: "Pattern", icon: GitBranch },
      { path: "/pattern-prediction/prediction", label: "Prediction", icon: BrainCircuit },
      { path: "/pattern-prediction/anomalies", label: "Anomalies", icon: Activity },
      { path: "/pattern-prediction/training", label: "Training", icon: Target },
      { path: "/pattern-prediction/training-lovelable", label: "Training Lovelable", icon: Heart },
      { path: "/pattern-prediction/live-inference", label: "Live Inference", icon: PlayCircle },
    ]
  },
  {
    path: "/demo",
    label: "Demo",
    icon: PlayCircle,
    children: [
      { path: "/demo/rca-flow", label: "RCA Flow", icon: Workflow },
      { path: "/demo/playground", label: "Playground", icon: PlayCircle },
      { path: "/demo/impact", label: "Impact Analysis", icon: BarChart3 },
    ]
  },
  {
    path: "/temp",
    label: "Temp",
    icon: FolderArchive,
    children: [
      { path: "/preprocessing", label: "Pre-Processing", icon: FileInput },
      { path: "/rca-impact", label: "RCA & Impact", icon: Search },
      { path: "/remediation", label: "Remediation", icon: Wrench },
      { path: "/upload", label: "Event Upload", icon: Upload },
    ]
  },
  {
    path: "/playground",
    label: "Playground",
    icon: Settings, // or any icon
    children: [
      { path: "/playground/rca", label: "RCA Playground", icon: Workflow },
      { path: "/playground/ml-pred-corr", label: "ML Pred Corr Patterns", icon: BrainCircuit },
    ]
  },

];

export function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['/admin', '/demo']);
  const location = useLocation();

  // Auto-expand menus based on current path
  useEffect(() => {
    const activeParents = navItems
      .filter(item => item.children?.some(child => location.pathname === child.path))
      .map(item => item.path);

    if (activeParents.length > 0) {
      setOpenMenus(prev => {
        const newMenus = [...prev];
        activeParents.forEach(p => {
          if (!newMenus.includes(p)) newMenus.push(p);
        });
        return newMenus;
      });
    }
  }, [location.pathname]);

  const toggleMenu = (path: string) => {
    setOpenMenus(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.path);
    const isChildActive = hasChildren && item.children?.some(child => location.pathname === child.path);
    const Icon = item.icon;

    if (collapsed) {
      return (
        <Tooltip key={item.path} delayDuration={0}>
          <TooltipTrigger asChild>
            <NavLink
              to={hasChildren ? item.children![0].path : item.path}
              className={cn(
                "flex items-center justify-center h-10 w-full rounded-lg transition-colors",
                (isActive || isChildActive)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (hasChildren) {
      return (
        <Collapsible key={item.path} open={isOpen} onOpenChange={() => toggleMenu(item.path)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-between w-full min-h-[2.5rem] py-2 px-3 rounded-lg transition-colors",
                isChildActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {item.children!.map((child) => {
              const ChildIcon = child.icon;
              const isChildItemActive = location.pathname === child.path;
              return (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={cn(
                    "flex items-center gap-3 h-9 px-3 rounded-lg transition-colors text-sm",
                    isChildItemActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <ChildIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{child.label}</span>
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center gap-3 h-10 px-3 rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className={cn("h-full bg-card/50 border-r border-border flex flex-col transition-all duration-300", collapsed ? "w-16" : "w-56")}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/infraon_logo.jpg" alt="Infraon Logo" className="h-8 w-8 object-contain rounded-md" />
            <span className="font-bold text-foreground">IEP</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", collapsed && "mx-auto")} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map(renderNavItem)}
      </nav>
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">v1.0.0</p>
        </div>
      )}
    </div>
  );
}
