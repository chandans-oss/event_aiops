import { useState } from 'react';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { PatternAnalysisDashboard } from '@/features/analytics/components/PatternAnalysisDashboard';
import { CorrelationSimulation } from '@/features/analytics/components/CorrelationSimulation';
import { Button } from '@/shared/components/ui/button';
import { TestTube2 } from 'lucide-react';

export default function CorrelationPage() {
    const [showSimulation, setShowSimulation] = useState(false);

    return (
        <MainLayout>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Top Navigation Bar */}
                <div className="h-16 border-b border-border/50 px-6 flex items-center justify-between bg-card/30 backdrop-blur-sm shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Pattern Analysis & Behavioral Correlation</h1>
                        <p className="text-xs text-muted-foreground">Learned network behavior patterns derived from historical incidents and live correlation engine.</p>
                    </div>
                    {!showSimulation && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
                            onClick={() => setShowSimulation(true)}
                        >
                            <TestTube2 className="h-4 w-4" />
                            Run Scenario Simulation
                        </Button>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-hidden">
                    {showSimulation ? (
                        <CorrelationSimulation onBack={() => setShowSimulation(false)} />
                    ) : (
                        <PatternAnalysisDashboard />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

