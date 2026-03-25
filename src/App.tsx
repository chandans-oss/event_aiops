import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import AlarmPredictionDashboard from "@/features/analytics/pages/AlarmPredictionDashboard";
import PredictionDashboard from "@/features/analytics/pages/PredictionDashboard";
import KpiDashboard from "@/features/analytics/pages/KpiDashboard";
import RcaAnalysisDashboard from "@/features/analytics/pages/RcaAnalysisDashboard";
import RoiDashboard from "@/features/analytics/pages/RoiDashboard";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/shared/components/common/ErrorBoundary";
import AnalyticsDashboard from "@/features/analytics/pages/AnalyticsDashboard";
import Events from "@/features/events/pages/EventsPage";
import PredictedEvents from "@/features/events/pages/PredictedEventsPage";
import Preprocessing from "@/features/analytics/pages/PreprocessingPage";
import Clustering from "@/features/analytics/pages/ClusteringPage";
import RCAImpact from "@/features/rca/pages/RcaImpactPage";
import Remediation from "@/features/remediation/pages/RemediationPage";
import Topology from "@/features/topology/pages/TopologyPage";
import Admin from "@/features/admin/pages/AdminPage";
import EventUpload from "@/features/events/pages/EventUploadPage";
import RCAFlow from "./pages/demo/RCAFlow";
import Playground from "./pages/demo/Playground";
import ImpactAnalysis from "./pages/demo/ImpactAnalysis";
import RCADetailPage from "@/features/rca/pages/RcaDetailPage";
import ImpactDetailPage from "@/features/impact/pages/ImpactDetailPage";
import CorrelationPage from "@/features/analytics/pages/CorrelationPage";
import KBDetailPage from "@/features/admin/pages/KBDetailPage";
import AgentsPage from "@/features/agents/pages/AgentsPage";
import LiveInferencePage from "./pages/LiveInferencePage";
import NotFound from "@/shared/components/common/NotFound";
import RCAPlaygroundPage from "./pages/RCAPlaygroundPage";
import PatternPage from "./pages/PatternPage";
import PredictionPage from "./pages/PredictionPage";
import AnomaliesPage from "./pages/AnomaliesPage";
import ModelOutputsPage from "./pages/ModelOutputsPage";
import TrainingAnalysisPage from "./pages/TrainingAnalysisPage";
import TrainingLovelablePage from "./pages/TrainingLovelablePage";
import LovelableResultsPage from "./pages/LovelableResultsPage";
import AlgoConfigPage from "./pages/algo-training/AlgoConfigPage";
import AlgoTrainingPage from "./pages/algo-training/AlgoTrainingPage";
import AlgoResultsPage from "./pages/algo-training/AlgoResultsPage";
import EventProcessingPage from "./pages/EventProcessingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {/* Pattern Prediction - Results first to avoid any shadowing */}
              <Route path="/pattern-prediction/results" element={<LovelableResultsPage />} />
              <Route path="/pattern-prediction/training" element={<TrainingLovelablePage />} />
              <Route path="/pattern-prediction/prediction" element={<PredictionPage />} />
              <Route path="/pattern-prediction/anomalies" element={<AnomaliesPage />} />
              <Route path="/pattern-prediction/pattern" element={<PatternPage />} />
              <Route path="/pattern-prediction/live-inference" element={<LiveInferencePage />} />
              <Route path="/pattern-prediction/live_inference" element={<LiveInferencePage />} />
              <Route path="/pattern-prediction/model-outputs" element={<ModelOutputsPage />} />
              <Route path="/pattern-prediction/training-analysis" element={<TrainingAnalysisPage />} />
              <Route path="/pattern-prediction/training/analysis/:modelId" element={<TrainingAnalysisPage />} />
              
              {/* Algo Training */}
              <Route path="/algo-training/config" element={<AlgoConfigPage />} />
              <Route path="/algo-training/training" element={<AlgoTrainingPage />} />
              <Route path="/algo-training/results" element={<AlgoResultsPage />} />
              
              <Route path="/" element={<AnalyticsDashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/predicted" element={<PredictedEvents />} />
              <Route path="/rca/detail/:id" element={<RCADetailPage />} />
              <Route path="/impact/detail/:id" element={<ImpactDetailPage />} />
              <Route path="/preprocessing" element={<Preprocessing />} />
              <Route path="/clustering" element={<Clustering />} />
              <Route path="/rca-impact" element={<RCAImpact />} />
              <Route path="/remediation" element={<Remediation />} />
              <Route path="/topology" element={<Topology />} />
              <Route path="/correlation" element={<CorrelationPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/dashboard/alarm-prediction" element={<AlarmPredictionDashboard />} />
              <Route path="/dashboard/prediction" element={<PredictionDashboard />} />
              <Route path="/dashboard/kpi" element={<KpiDashboard />} />
              <Route path="/dashboard/rca-analysis" element={<RcaAnalysisDashboard />} />
              <Route path="/dashboard/roi" element={<RoiDashboard />} />
              <Route path="/admin/kb/:id" element={<KBDetailPage />} />
              <Route path="/upload" element={<EventUpload />} />
              <Route path="/demo/rca-flow" element={<RCAFlow />} />
              <Route path="/demo/playground" element={<Playground />} />
              <Route path="/demo/impact" element={<ImpactAnalysis />} />
              <Route path="/playground/rca" element={<RCAPlaygroundPage />} />
              <Route path="/playground/event-processing" element={<EventProcessingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
