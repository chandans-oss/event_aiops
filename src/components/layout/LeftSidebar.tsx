import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/events", label: "Events", icon: Activity },
  {
    path: "/admin",
    label: "Admin",
    icon: Settings,
    children: [
      { path: "/admin", label: "Configuration", icon: Settings },
      { path: "/admin/upload", label: "Upload Data", icon: Upload },
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
      { path: "/clustering", label: "Clustering", icon: GitBranch },
      { path: "/rca-impact", label: "RCA & Impact", icon: Search },
      { path: "/remediation", label: "Remediation", icon: Wrench },
      { path: "/upload", label: "Event Upload", icon: Upload },
    ]
  },
];

export function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['/admin', '/demo']);
  const location = useLocation();

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
                "flex items-center justify-between w-full h-10 px-3 rounded-lg transition-colors",
                isChildActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
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
