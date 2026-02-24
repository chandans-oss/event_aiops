import { useState, useEffect } from 'react';
import { Copy, Layers, GitBranch, Plus, Edit2, Trash2, GripVertical, ToggleLeft, Clock, Wrench, AlertTriangle, MapPin, Network, Brain, Search, X, Server, RefreshCw, Timer, ListChecks, ArrowRightCircle, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { mockDeduplicationRules, mockSuppressionRules, mockCorrelationRules } from '@/data/mock/mockData';
import { DeduplicationRuleForm, SuppressionRuleForm, DeleteRuleDialog } from './RuleForms';
import { DeduplicationRule, SuppressionRule, CorrelationRule } from '@/shared/types';

// Deduplication rule icons and labels
const dedupRuleConfig: Record<string, { icon: any; label: string }> = {
  exact_match: { icon: Copy, label: 'Exact Match' },
  time_window: { icon: Clock, label: 'Time Window' },
  source_based: { icon: Server, label: 'Source Based' },
};

// Suppression rule icons and labels
const suppressionRuleConfig: Record<string, { icon: any; label: string }> = {
  maintenance: { icon: Wrench, label: 'Maintenance' },
  business_hours: { icon: Clock, label: 'Business Hours' },
  reboot_pattern: { icon: RefreshCw, label: 'Reboot Pattern' },
  time_based: { icon: Timer, label: 'Time Based' },
};

// Correlation rule icons and labels
const correlationRuleConfig: Record<string, { icon: any; label: string }> = {
  temporal: { icon: Clock, label: 'Temporal' },
  spatial: { icon: MapPin, label: 'Spatial' },
  topological: { icon: Network, label: 'Topological' },
  causal_rule_based: { icon: ArrowRightCircle, label: 'Causal / Rule-based' },
  dynamic_rule: { icon: Layers, label: 'Dynamic Rule Correlation' },
  ml_gnn_refinement: { icon: Brain, label: 'ML/GNN Refinement' },
  llm_semantic: { icon: Zap, label: 'LLM Semantic Synthesis' },
};

export function RulesSection({ section }: { section: 'suppression' | 'deduplication' | 'correlation-types' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    setTypeFilter('all');
  }, [section]);

  // Form dialog states
  const [showDedupForm, setShowDedupForm] = useState(false);
  const [showSuppressionForm, setShowSuppressionForm] = useState(false);
  const [editingDedupRule, setEditingDedupRule] = useState<DeduplicationRule | undefined>();
  const [editingSuppressionRule, setEditingSuppressionRule] = useState<SuppressionRule | undefined>();

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<{ name: string; id: string } | null>(null);

  // Filter function for rules
  const filterRules = <T extends { name: string; description: string; status: string; type: string }>(rules: T[]) => {
    return rules.filter((rule) => {
      const matchesSearch = searchQuery === '' ||
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
      const matchesType = typeFilter === 'all' || rule.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  // Get type options based on current section
  const getTypeOptions = () => {
    switch (section) {
      case 'suppression':
        return Object.entries(suppressionRuleConfig).map(([key, value]) => ({ value: key, label: value.label }));
      case 'deduplication':
        return Object.entries(dedupRuleConfig).map(([key, value]) => ({ value: key, label: value.label }));
      case 'correlation-types':
        return Object.entries(correlationRuleConfig).map(([key, value]) => ({ value: key, label: value.label }));
      default:
        return [];
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  const filteredSuppressionRules = filterRules(mockSuppressionRules || []);
  const filteredDeduplicationRules = filterRules(mockDeduplicationRules || []);
  const filteredCorrelationRules = filterRules(mockCorrelationRules || []);

  // Handle add button click
  const handleAddRule = () => {
    switch (section) {
      case 'suppression':
        setEditingSuppressionRule(undefined);
        setShowSuppressionForm(true);
        break;
      case 'deduplication':
        setEditingDedupRule(undefined);
        setShowDedupForm(true);
        break;
    }
  };

  // Handle edit button click
  const handleEditDedup = (rule: DeduplicationRule) => {
    setEditingDedupRule(rule);
    setShowDedupForm(true);
  };

  const handleEditSuppression = (rule: SuppressionRule) => {
    setEditingSuppressionRule(rule);
    setShowSuppressionForm(true);
  };

  // Handle delete
  const handleDeleteClick = (rule: { name: string; id: string }) => {
    setRuleToDelete(rule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would delete from the database
    console.log('Deleting rule:', ruleToDelete?.id);
    setRuleToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Removed Rules Management Title and Description for cleaner UI */}


      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules by name, description, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {getTypeOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Suppression Rules */}
      {section === 'suppression' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Suppression Rules </h2>
            <Button className="gap-2 gradient-primary" onClick={handleAddRule}>
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>
          {(filteredSuppressionRules || []).length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No rules found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(filteredSuppressionRules || []).map((rule) => {
                const config = suppressionRuleConfig[rule.type] || { icon: ToggleLeft, label: rule.type };
                const Icon = config.icon;
                return (
                  <div
                    key={rule.id}
                    className="glass-card rounded-xl p-5 hover-lift cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-severity-high/20">
                          <Icon className="h-5 w-5 text-severity-high" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        </div>
                      </div>
                      <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {rule.description}
                    </p>
                    <div className="flex items-center justify-end pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.status === 'active'} />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSuppression(rule)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(rule)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Deduplication Rules */}
      {section === 'deduplication' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Deduplication Rules</h2>
            <Button className="gap-2 gradient-primary" onClick={handleAddRule}>
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>
          {(filteredDeduplicationRules || []).length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No rules found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(filteredDeduplicationRules || []).map((rule) => {
                const config = dedupRuleConfig[rule.type] || { icon: Copy, label: rule.type };
                const Icon = config.icon;
                return (
                  <div
                    key={rule.id}
                    className="glass-card rounded-xl p-5 hover-lift cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        </div>
                      </div>
                      <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {rule.description}
                    </p>
                    <div className="flex items-center justify-end pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.status === 'active'} />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDedup(rule)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(rule)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Correlation Rules */}
      {section === 'correlation-types' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Correlation Types</h2>
          </div>
          {(filteredCorrelationRules || []).length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No rules found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(filteredCorrelationRules || []).map((rule) => {
                const config = correlationRuleConfig[rule.type] || { icon: GitBranch, label: rule.type };
                const Icon = config.icon;
                return (
                  <div
                    key={rule.id}
                    className="glass-card rounded-xl p-5 hover-lift cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-success/20">
                          <Icon className="h-5 w-5 text-status-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {rule.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      {rule.mlEnabled && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">ML</Badge>
                      )}
                      {rule.gnnEnabled && (
                        <Badge className="bg-severity-medium/20 text-severity-medium border-severity-medium/30">GNN</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-end pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.status === 'active'} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(rule)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Form Dialogs */}
      <DeduplicationRuleForm
        open={showDedupForm}
        onOpenChange={setShowDedupForm}
        rule={editingDedupRule}
        onSave={(data) => console.log('Save dedup rule:', data)}
      />

      <SuppressionRuleForm
        open={showSuppressionForm}
        onOpenChange={setShowSuppressionForm}
        rule={editingSuppressionRule}
        onSave={(data) => console.log('Save suppression rule:', data)}
      />



      {/* Delete Confirmation */}
      <DeleteRuleDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ruleName={ruleToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
