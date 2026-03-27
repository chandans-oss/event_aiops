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
  FileText,
  Layers,
  RefreshCw,
  MessageSquare,
  Sliders,
  ShieldCheck,
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
      { path: "/dashboard/prediction", label: "PredictionDashboard", icon: Activity },
      { path: "/dashboard/kpi", label: "KpiDashboard", icon: BarChart3 },
      { path: "/dashboard/rca-analysis", label: "RcaAnalysis", icon: Search },
      { path: "/dashboard/alarm-prediction", label: "AlarmPrediction", icon: TrendingUp },
      { path: "/dashboard/roi", label: "RoiDashboard", icon: Target },
    ]
  },
  {
    path: "/events",
    label: "Events",
    icon: Activity,
    children: [
      { path: "/events", label: "EventList", icon: List },
      { path: "/events/predicted", label: "Prediction", icon: TrendingUp },
      { path: "/clustering", label: "AnomalyDetection", icon: GitBranch },
      { path: "/correlation", label: "PatternDetection", icon: BrainCircuit },
    ]
  },
  {
    path: "/event-processing",
    label: "EventProcessing",
    icon: Activity,
    children: [
      { path: "/event-processing/deduplication", label: "Dedup Lab", icon: FolderArchive },
      { path: "/event-processing/suppression", label: "Suppression Lab", icon: ShieldCheck },
      { path: "/event-processing/bulk-processing", label: "Bulk Processing Lab", icon: FileText },
    ]
  },
  { path: "/topology", label: "Topology", icon: Network },
  {
    path: "/admin",
    label: "Admin",
    icon: Settings,
    children: [
      { path: "/admin", label: "Configuration", icon: Settings },
    ]
  },
  { path: "/agents", label: "Agents", icon: Bot },
  {
    path: "/pattern-prediction",
    label: "PatternPrediction",
    icon: TrendingUp,
    children: [
      { path: "/pattern-prediction/pattern", label: "Pattern", icon: GitBranch },
      { path: "/pattern-prediction/prediction", label: "Prediction", icon: BrainCircuit },
      { path: "/pattern-prediction/anomalies", label: "Anomalies", icon: Activity },
      { path: "/pattern-prediction/training", label: "Training", icon: Target },
      { path: "/pattern-prediction/results", label: "Results", icon: FileText },
      { path: "/pattern-prediction/live-inference", label: "LiveInference", icon: PlayCircle },
    ]
  },
  {
    path: "/playground",
    label: "Playground",
    icon: Settings,
    children: [
      { path: "/playground/rca", label: "RcaPlayground", icon: Workflow },
    ]
  },
  {
    path: "/demo",
    label: "Demo",
    icon: PlayCircle,
    children: [
      { path: "/demo/rca-flow", label: "RcaFlow", icon: Workflow },
      { path: "/demo/playground", label: "Playground", icon: PlayCircle },
      { path: "/demo/impact", label: "ImpactAnalysis", icon: BarChart3 },
    ]
  },
  {
    path: "/temp",
    label: "Temp",
    icon: FolderArchive,
    children: [
      { path: "/preprocessing", label: "PreProcessing", icon: FileInput },
      { path: "/rca-impact", label: "RcaImpact", icon: Search },
      { path: "/remediation", label: "Remediation", icon: Wrench },
      { path: "/upload", label: "EventUpload", icon: Upload },
    ]
  },
];

export function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
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

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const isActive = location.pathname === item.path || (location.pathname + location.search) === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.path);
    const isChildActive = hasChildren && item.children?.some(child => 
      location.pathname === child.path || (location.pathname + location.search) === child.path
    );
    const Icon = item.icon;

    const content = (
      <>
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={cn(level === 0 ? "h-5 w-5" : "h-4 w-4", "flex-shrink-0")} />
          <span className={cn(level === 0 ? "text-sm" : "text-[13px]", "font-medium truncate")}>
            {item.label}
          </span>
        </div>
        {hasChildren && !collapsed && (
          <ChevronDown className={cn("h-4 w-4 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
        )}
      </>
    );

    if (collapsed && level === 0) {
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

    if (hasChildren && !collapsed) {
      return (
        <Collapsible key={item.path} open={isOpen} onOpenChange={() => toggleMenu(item.path)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-between w-full min-h-[2.5rem] py-2 px-3 rounded-lg transition-colors",
                isChildActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                level > 0 && "py-1.5"
              )}
              style={{ paddingLeft: `${(level + 1) * 12}px` }}
            >
              {content}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItemComponent key={child.path} item={child} level={level + 1} />
            ))}
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
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          level > 0 && "h-8"
        )}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
      >
        {content}
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
        {navItems.map(item => <NavItemComponent key={item.path} item={item} />)}
      </nav>
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">v1.0.0</p>
        </div>
      )}
    </div>
  );
}
