import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import AlarmPredictionDashboard from "@/features/analytics/pages/AlarmPredictionDashboard";
import PredictionDashboard from "@/features/analytics/pages/PredictionDashboard";
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
import MLExplainabilityAdmin from "@/features/admin/pages/MLExplainabilityAdminPage";
import EventUpload from "@/features/events/pages/EventUploadPage";
import UploadData from "./pages/admin/UploadData";
import RCAFlow from "./pages/demo/RCAFlow";
import Playground from "./pages/demo/Playground";
import ImpactAnalysis from "./pages/demo/ImpactAnalysis";
import RCADetailPage from "@/features/rca/pages/RcaDetailPage";
import ImpactDetailPage from "@/features/impact/pages/ImpactDetailPage";
// import EventCorrelationClustersPage from "@/features/events/pages/EventCorrelationPage";
import CorrelationPage from "@/features/analytics/pages/CorrelationPage";
import KBDetailPage from "@/features/admin/pages/KBDetailPage";
import AgentsPage from "@/features/agents/pages/AgentsPage";
import LiveInferencePage from "./pages/LiveInferencePage";
import NotFound from "@/shared/components/common/NotFound";
import RCAPlaygroundPage from "./pages/RCAPlaygroundPage";
import MLPredCorrPatternsPage from "./pages/MLPredCorrPatternsPage";
import PatternPage from "./pages/PatternPage";
import PredictionPage from "./pages/PredictionPage";
import AnomaliesPage from "./pages/AnomaliesPage";
import ModelOutputsPage from "./pages/ModelOutputsPage";
import TrainingPage from "./pages/TrainingPage";
import TrainingAnalysisPage from "./pages/TrainingAnalysisPage";
import TrainingLovelablePage from "./pages/TrainingLovelablePage";

console.log("[App] Routes initialized at 10:54");

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
              <Route path="/pattern-prediction/live-inference" element={<LiveInferencePage />} />
              <Route path="/pattern-prediction/live_inference" element={<LiveInferencePage />} />
              <Route path="/pattern-prediction/model-outputs" element={<ModelOutputsPage />} />
              
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
              {/* <Route path="/event-correlation-clusters/:clusterId" element={<EventCorrelationClustersPage />} /> */}
              <Route path="/correlation" element={<CorrelationPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/ai-explainability" element={<MLExplainabilityAdmin />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/dashboard/alarm-prediction" element={<AlarmPredictionDashboard />} />
              <Route path="/dashboard/prediction" element={<PredictionDashboard />} />
              <Route path="/dashboard/roi" element={<RoiDashboard />} />
              <Route path="/admin/upload" element={<UploadData />} />
              <Route path="/admin/kb/:id" element={<KBDetailPage />} />
              <Route path="/upload" element={<EventUpload />} />
              <Route path="/demo/rca-flow" element={<RCAFlow />} />
              <Route path="/demo/playground" element={<Playground />} />
              <Route path="/demo/impact" element={<ImpactAnalysis />} />
              <Route path="/playground/rca" element={<RCAPlaygroundPage />} />
              <Route path="/playground/ml-pred-corr" element={<MLPredCorrPatternsPage />} />
              <Route path="/pattern-prediction/pattern" element={<PatternPage />} />
              <Route path="/pattern-prediction/prediction" element={<PredictionPage />} />
              <Route path="/pattern-prediction/anomalies" element={<AnomaliesPage />} />
              <Route path="/pattern-prediction/training" element={<TrainingPage />} />
              <Route path="/pattern-prediction/training-lovelable" element={<TrainingLovelablePage />} />
              <Route path="/pattern-prediction/training/analysis/:modelId" element={<TrainingAnalysisPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>

      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
