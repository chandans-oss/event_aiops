import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { useToast } from '@/shared/hooks/use-toast';
import { DeduplicationRule, SuppressionRule, CorrelationRule } from '@/shared/types';

// Base rule schema
const baseRuleSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().trim().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  status: z.enum(['active', 'inactive']),
});

// Deduplication rule schema
const deduplicationRuleSchema = baseRuleSchema.extend({
  type: z.enum(['same_alert_type', 'same_severity', 'same_error_message', 'same_event_multi_source']),
  matchCriteria: z.string().optional(),
});

// Suppression rule schema
const suppressionRuleSchema = baseRuleSchema.extend({
  type: z.enum(['business_hours', 'user_defined_time', 'assets_maintenance']),
  affectedDevices: z.string().optional(),
  scheduleStart: z.string().optional(),
  scheduleEnd: z.string().optional(),
  businessDays: z.string().optional(),
  businessStartTime: z.string().optional(),
  businessEndTime: z.string().optional(),
});

// Correlation rule schema
const correlationRuleSchema = baseRuleSchema.extend({
  type: z.enum(['causal', 'temporal', 'spatial', 'topological', 'gnn']),
  mlEnabled: z.boolean(),
  gnnEnabled: z.boolean(),
  traceDepth: z.coerce.number().min(1).max(10).optional(),
  groupingCriteria: z.string().optional(),
});

type DeduplicationFormData = z.infer<typeof deduplicationRuleSchema>;
type SuppressionFormData = z.infer<typeof suppressionRuleSchema>;
type CorrelationFormData = z.infer<typeof correlationRuleSchema>;

// Deduplication Rule Form
interface DeduplicationRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: DeduplicationRule;
  onSave: (data: DeduplicationFormData) => void;
}

export function DeduplicationRuleForm({ open, onOpenChange, rule, onSave }: DeduplicationRuleFormProps) {
  const { toast } = useToast();
  const isEditing = !!rule;

  const form = useForm<DeduplicationFormData>({
    resolver: zodResolver(deduplicationRuleSchema),
    defaultValues: {
      name: rule?.name || '',
      description: rule?.description || '',
      status: rule?.status || 'active',
      type: rule?.type || 'same_alert_type',
      matchCriteria: rule?.config?.matchCriteria?.join(', ') || '',
    },
  });

  const handleSubmit = (data: DeduplicationFormData) => {
    onSave(data);
    toast({
      title: isEditing ? 'Rule updated' : 'Rule created',
      description: `Deduplication rule "${data.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} Deduplication Rule</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Same Alert Type Dedup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="same_alert_type">Same Alert Type</SelectItem>
                      <SelectItem value="same_severity">Same Severity</SelectItem>
                      <SelectItem value="same_error_message">Same Error Message</SelectItem>
                      <SelectItem value="same_event_multi_source">Same Event Multi-Source</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this rule does..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="matchCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Match Criteria (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., alertType, source, severity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {isEditing ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Suppression Rule Form
interface SuppressionRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: SuppressionRule;
  onSave: (data: SuppressionFormData) => void;
}

export function SuppressionRuleForm({ open, onOpenChange, rule, onSave }: SuppressionRuleFormProps) {
  const { toast } = useToast();
  const isEditing = !!rule;

  const form = useForm<SuppressionFormData>({
    resolver: zodResolver(suppressionRuleSchema),
    defaultValues: {
      name: rule?.name || '',
      description: rule?.description || '',
      status: rule?.status || 'active',
      type: rule?.type || 'business_hours',
      affectedDevices: rule?.affectedDevices?.join(', ') || '',
      scheduleStart: rule?.config?.schedule?.start || '',
      scheduleEnd: rule?.config?.schedule?.end || '',
      businessDays: rule?.config?.businessHours?.days?.join(', ') || 'Mon, Tue, Wed, Thu, Fri',
      businessStartTime: rule?.config?.businessHours?.startTime || '09:00',
      businessEndTime: rule?.config?.businessHours?.endTime || '18:00',
    },
  });

  const ruleType = form.watch('type');

  const handleSubmit = (data: SuppressionFormData) => {
    onSave(data);
    toast({
      title: isEditing ? 'Rule updated' : 'Rule created',
      description: `Suppression rule "${data.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} Suppression Rule</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Business Hours Suppression" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="business_hours">Business Hours</SelectItem>
                      <SelectItem value="user_defined_time">User Defined Time</SelectItem>
                      <SelectItem value="assets_maintenance">Assets Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this rule does..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Hours Fields */}
            {ruleType === 'business_hours' && (
              <>
                <FormField
                  control={form.control}
                  name="businessDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Days</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mon, Tue, Wed, Thu, Fri" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessStartTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessEndTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* User Defined Time / Maintenance Fields */}
            {(ruleType === 'user_defined_time' || ruleType === 'assets_maintenance') && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduleStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Start</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduleEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule End</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Affected Devices */}
            {ruleType === 'assets_maintenance' && (
              <FormField
                control={form.control}
                name="affectedDevices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affected Devices (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., db-server-01, db-server-02" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {isEditing ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Correlation Rule Form
interface CorrelationRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: CorrelationRule;
  onSave: (data: CorrelationFormData) => void;
}

export function CorrelationRuleForm({ open, onOpenChange, rule, onSave }: CorrelationRuleFormProps) {
  const { toast } = useToast();
  const isEditing = !!rule;

  const form = useForm<CorrelationFormData>({
    resolver: zodResolver(correlationRuleSchema),
    defaultValues: {
      name: rule?.name || '',
      description: rule?.description || '',
      status: rule?.status || 'active',
      type: rule?.type || 'causal',
      mlEnabled: rule?.mlEnabled || false,
      gnnEnabled: rule?.gnnEnabled || false,
      traceDepth: rule?.config?.traceDepth || 3,
      groupingCriteria: rule?.config?.groupingCriteria?.join(', ') || '',
    },
  });

  const ruleType = form.watch('type');

  const handleSubmit = (data: CorrelationFormData) => {
    onSave(data);
    toast({
      title: isEditing ? 'Rule updated' : 'Rule created',
      description: `Correlation rule "${data.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} Correlation Rule</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Database Cascade Detection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="causal">Causal</SelectItem>
                      <SelectItem value="temporal">Temporal</SelectItem>
                      <SelectItem value="spatial">Spatial</SelectItem>
                      <SelectItem value="topological">Topological</SelectItem>
                      <SelectItem value="gnn">GNN</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this rule does..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ML and GNN toggles */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mlEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <FormLabel className="text-sm font-medium">Enable ML</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gnnEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <FormLabel className="text-sm font-medium">Enable GNN</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Trace Depth for topological/causal/gnn */}
            {(ruleType === 'topological' || ruleType === 'causal' || ruleType === 'gnn') && (
              <FormField
                control={form.control}
                name="traceDepth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trace Depth</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Grouping Criteria for spatial */}
            {ruleType === 'spatial' && (
              <FormField
                control={form.control}
                name="groupingCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grouping Criteria (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., datacenter, rack, region" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {isEditing ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
interface DeleteRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleName: string;
  onConfirm: () => void;
}

export function DeleteRuleDialog({ open, onOpenChange, ruleName, onConfirm }: DeleteRuleDialogProps) {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: 'Rule deleted',
      description: `Rule "${ruleName}" has been deleted successfully.`,
      variant: 'destructive',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Rule</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete the rule <strong className="text-foreground">"{ruleName}"</strong>? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
