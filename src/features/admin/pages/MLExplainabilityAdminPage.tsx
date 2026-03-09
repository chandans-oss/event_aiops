import { useState } from 'react';
import {
    Settings,
    BrainCircuit,
    Cpu,
    Database,
    Activity,
    Search,
    Clock,
    Zap,
    Box,
    BarChart3,
    RefreshCw,
    Info,
    CheckCircle2,
    AlertTriangle,
    History,
    ShieldCheck,
    Workflow
} from 'lucide-react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { MLExplainabilityPanel } from '@/features/analytics/components/MLExplainabilityPanel';
import { cn } from '@/shared/lib/utils';

// --- Mock Data ---

const modelRegistry = [
    { id: 'rf-01', name: 'RandomForest Prediction', status: 'Healthy', accuracy: 0.97, version: 'v2.0.0', type: 'Classification' },
    { id: 'if-02', name: 'Isolation Forest Anomaly', status: 'Healthy', accuracy: 0.95, version: 'v2.0.0', type: 'Unsupervised' },
    { id: 'km-03', name: 'KMeans Pattern Clustering', status: 'Healthy', accuracy: 0.92, version: 'v2.0.0', type: 'Clustering' },
    { id: 'fp-04', name: 'FP-Growth Sequence Mining', status: 'Healthy', accuracy: 0.99, version: 'v2.0.0', type: 'Association' },
];

const featureImportanceData = [
    { name: 'util_pct_last', importance: 16.8 },
    { name: 'queue_depth_last', importance: 15.1 },
    { name: 'latency_ms_last', importance: 14.0 },
    { name: 'crc_errors_last', importance: 9.9 },
    { name: 'util_pct_mean', importance: 6.3 },
    { name: 'queue_depth_mean', importance: 5.3 },
];

const pieData = [
    { name: 'Packet Drop', value: 33, color: '#ef4444' },
    { name: 'High Util Warning', value: 32, color: '#f59e0b' },
    { name: 'Interface Flap', value: 23, color: '#3b82f6' },
    { name: 'High Latency', value: 12, color: '#10b981' },
];

const mockExplainabilityData = {
    context: {
        device: "router-01",
        interface: "Gi0/1/0",
        vendor: "AI Engine",
        eventType: "HIGH_UTIL_WARNING",
        detectionType: "Random Forest Predictor",
        timestamp: "2026-03-03 19:08:28"
    },
    metrics: {
        system_load: 0.45,
        inference_count: "8,160",
        error_rate: "0.048%",
        avg_latency: "12ms"
    },
    features: [
        { name: "util_pct_last", value: 0.1683 },
        { name: "latency_ms_last", value: 0.1290 },
        { name: "queue_depth_last", value: 0.1238 }
    ],
    modelDecision: {
        model: "Random Forest",
        details: { probability: 0.952 },
        importance: [
            { name: "util_pct_last", importance: 0.1683 },
            { name: "latency_ms_last", importance: 0.1290 },
            { name: "queue_depth_last", importance: 0.1238 }
        ]
    },
    trainingMetadata: {
        datasetSize: 8160,
        featureCount: 70,
        trainingDate: "2026-03-03",
        metrics: {
            accuracy: 0.952,
            precision: 0.830,
            recall: 0.934,
            f1: 0.879
        }
    },
    pipeline: [
        { stage: "Data Preprocessing (8,640 rows)", time: "Synchronized", status: "complete" as const },
        { stage: "Sliding Windows (70 dims)", time: "Synchronized", status: "complete" as const },
        { stage: "Random Forest Prediction", time: "Active", status: "complete" as const }
    ]
};

const algorithmLibrary = [
    {
        name: 'Random Forest Event Predictor',
        category: 'Prediction',
        description: 'Ensemble learning method that constructs 150 decision trees during training. Predicts events like HIGH_UTIL_WARNING or PACKET_DROP based on multivariate telemetry windows.',
        math: 'P(c|x) = 1/T Σ f_t(x)',
        parameters: 'trees=150, max_depth=10, min_event_rate=0.02'
    },
    {
        name: 'Isolation Forest',
        category: 'Anomaly',
        description: 'Unsupervised learning algorithm isolating outliers in the feature space. Flagged ~5.0% windows as anomalies across entities like router-05:Gi0/3/0.',
        math: 's(x, n) = 2^(-E[h(x)] / c(n))',
        parameters: 'contamination=0.05, n_estimators=100'
    },
    {
        name: 'KMeans Clustering',
        category: 'Pattern',
        description: 'Groups metric windows into clusters. Identified states like "Stable Baseline", "Gradual Rise", "Congestion Buildup", and "Spike/Recovery".',
        math: 'arg min Σ ||x - μ_i||^2',
        parameters: 'clusters=4, max_iter=300'
    },
    {
        name: 'Granger Causality',
        category: 'RCA',
        description: 'Statistical hypothesis test determining precedence. Found highly significant paths: util_pct -> queue_depth (lag=10m) and queue_depth -> crc_errors (lag=5m).',
        math: 'Y_t = Σ a_i Y_{t-i} + Σ b_j X_{t-j} + ε',
        parameters: 'max_lag=10min, p_value<0.05'
    },
    {
        name: 'FP-Growth Sequence Mining',
        category: 'Correlation',
        description: 'Extracts frequent event sequences. Mined sequences like HIGH_UTIL_WARNING -> PACKET_DROP -> INTERFACE_FLAP with 100% confidence.',
        math: 'Lift = Support(A∪B) / (Support(A) * Support(B))',
        parameters: 'min_support=2, min_lift=1.5'
    },
    {
        name: 'Cross-Correlation',
        category: 'Analysis',
        description: 'Time-domain analysis identifying lead/lag relationships. Revealed queue_depth leads util_pct by 5 min (r=0.9021).',
        math: 'r_{xy}(k) = Σ (x_t - μ_x)(y_{t-k} - μ_y) / (σ_x σ_y)',
        parameters: 'max_lag=15, metric=pearson'
    }
];

// --- Main Page ---

export default function MLExplainabilityAdminPage() {
    return (
        <MainLayout>
            <div className="p-6 space-y-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BrainCircuit className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">ML Explainability</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Central control for model registry, algorithm specifications, and decision fidelity
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Sync Registry
                        </Button>
                        <Button size="sm" className="gradient-primary gap-2">
                            <Workflow className="h-4 w-4" /> Retrain All
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="registry" className="w-full">
                    <TabsList className="bg-secondary/50 p-1 mb-6">
                        <TabsTrigger value="registry" className="gap-2 transition-all">
                            <Box className="h-4 w-4" /> Model Registry
                        </TabsTrigger>
                        <TabsTrigger value="algorithms" className="gap-2 transition-all">
                            <Settings className="h-4 w-4" /> Algorithm Library
                        </TabsTrigger>
                        <TabsTrigger value="training" className="gap-2 transition-all">
                            <Activity className="h-4 w-4" /> Performance
                        </TabsTrigger>
                        <TabsTrigger value="explainer" className="gap-2 transition-all">
                            <Search className="h-4 w-4" /> Live Preview
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Model Registry */}
                    <TabsContent value="registry" className="mt-0 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                {modelRegistry.map((model) => (
                                    <Card key={model.id} className="border-border/50 bg-card/40 hover:bg-secondary/20 transition-all cursor-pointer group">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-xl flex items-center justify-center",
                                                    model.status === 'Healthy' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    <Cpu className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg">{model.name}</h3>
                                                        <Badge variant="outline" className="text-[10px] uppercase">{model.version}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1"><Settings className="h-3 w-3" /> {model.type}</span>
                                                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Acc: {Math.round(model.accuracy * 100)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={cn(
                                                    "px-3 py-1",
                                                    model.status === 'Healthy' ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40" : "bg-amber-500/20 text-amber-500 border-amber-500/40"
                                                )} variant="outline">
                                                    {model.status}
                                                </Badge>
                                                <p className="text-[10px] text-muted-foreground mt-2">Active Since: 2026-03-01</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="lg:col-span-1 space-y-6">
                                <Card className="border-border/50 bg-card/40 overflow-hidden">
                                    <CardHeader className="py-4 border-b border-border/40 bg-muted/20">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Database className="h-4 w-4 text-primary" />
                                            Inference Volume
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="h-48 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {pieData.map((item) => (
                                                <div key={item.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                        <span className="text-xs text-muted-foreground">{item.name}</span>
                                                    </div>
                                                    <span className="text-xs font-bold">{item.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Algorithm Library */}
                    <TabsContent value="algorithms" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {algorithmLibrary.map((algo) => (
                                <Card key={algo.name} className="border-border/50 bg-card/40 overflow-hidden flex flex-col">
                                    <CardHeader className="bg-secondary/20 border-b border-border/40 py-3">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base font-bold">{algo.name}</CardTitle>
                                            <Badge variant="secondary" className="text-[10px]">{algo.category}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 flex-1 flex flex-col gap-4">
                                        <p className="text-sm text-muted-foreground leading-relaxed">{algo.description}</p>

                                        <div className="mt-auto space-y-3">
                                            <div className="bg-background/60 p-3 rounded-lg border border-border/50">
                                                <p className="text-[9px] font-bold text-primary uppercase mb-1">Mathematical Base</p>
                                                <code className="text-xs font-mono text-emerald-400">{algo.math}</code>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-muted-foreground uppercase">Runtime Parameters:</span>
                                                <span className="font-mono text-muted-foreground">{algo.parameters}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Tab 3: Performance */}
                    <TabsContent value="training" className="mt-0">
                        <Card className="border-border/50 bg-card/40 h-[500px]">
                            <CardHeader className="border-b border-border/40">
                                <CardTitle className="text-base font-bold">Inference Importance Matrix</CardTitle>
                                <CardDescription>Key features driving decisions across the network</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={featureImportanceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                                        <Bar dataKey="importance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 4: Live Preview */}
                    <TabsContent value="explainer" className="mt-0">
                        <Card className="border-border/50 bg-card/40 border-l-4 border-l-primary/50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base font-bold">Explainability Component Master</CardTitle>
                                </div>
                                <CardDescription>Reference preview of the Explainability Page logic</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <MLExplainabilityPanel mode="prediction" data={mockExplainabilityData} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
