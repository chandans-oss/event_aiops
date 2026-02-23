import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { ArrowLeft, BookOpen, Clock, Tag, Target, ArrowRightCircle, CheckCircle2, AlertTriangle, Layers, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { mockKBArticlesEnhanced } from '@/features/admin/data/adminData';
import { useEffect, useState } from 'react';
import { KBArticle } from '@/shared/types';

export default function KBDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<KBArticle | null>(null);

    useEffect(() => {
        if (id) {
            const found = mockKBArticlesEnhanced.find(a => a.id === id);
            if (found) setArticle(found);
        }
    }, [id]);

    if (!article) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-xl font-bold mb-4">Article Not Found</h2>
                    <Button onClick={() => navigate('/admin')}>Return to Admin</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">

                {/* Top Nav */}
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Knowledge Base
                </Button>

                {/* Header Section */}
                <div className="mb-8 p-6 bg-card border rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                                {article.category}
                            </Badge>
                            {article.subcategory && (
                                <Badge variant="secondary" className="px-3 py-1 bg-secondary/50">
                                    {article.subcategory}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-primary opacity-80" />
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> ID: {article.id}</span>
                            <span className="flex items-center gap-1.5"><Target className="h-4 w-4" /> Effectiveness: {article.effectiveness}%</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Last Updated: {new Date(article.lastUpdated).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Content Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Body */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">

                        {/* 1. Problem Definition */}
                        <section className="bg-destructive/5 border border-destructive/10 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Problem Definition
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {article.problem}
                            </p>
                        </section>

                        {/* 2. Discovered Area */}
                        <section className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-500">
                                <Layers className="h-5 w-5" />
                                Impacted Area / Technology
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {article.area}
                            </p>
                        </section>

                        {/* 3. Remedy Execution */}
                        <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-500">
                                <CheckCircle2 className="h-5 w-5" />
                                Remedy / Action Plan
                            </h2>
                            <div className="space-y-4">
                                {article.remedyItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start bg-background/50 p-4 rounded-lg border border-border/50">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <p className="text-foreground leading-relaxed pt-1 text-sm">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-1 space-y-6">

                        {/* Summary */}
                        <div className="bg-card border rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Overview Summary
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {article.content}
                            </p>
                        </div>

                        <Separator />

                        {/* Linked Intents */}
                        <div className="bg-card border rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                Linked System Intents
                            </h3>
                            <div className="flex flex-col gap-2">
                                {article.linkedIntents.map(intent => (
                                    <div key={intent} className="bg-muted/50 border rounded p-2 text-sm font-mono flex items-center gap-2 text-muted-foreground">
                                        <ArrowRightCircle className="h-3 w-3 text-primary" />
                                        {intent}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-card border rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Tag Index
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-secondary/40 hover:bg-secondary/60 transition-colors">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
