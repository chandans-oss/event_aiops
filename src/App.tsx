import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import AlarmPredictionDashboard from "@/features/analytics/pages/AlarmPredictionDashboard";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/shared/components/common/ErrorBoundary";
import AnalyticsDashboard from "@/features/analytics/pages/AnalyticsDashboard";
import Events from "@/features/events/pages/EventsPage";
import Preprocessing from "@/features/analytics/pages/PreprocessingPage";
import Clustering from "@/features/analytics/pages/ClusteringPage";
import RCAImpact from "@/features/rca/pages/RcaImpactPage";
import Remediation from "@/features/remediation/pages/RemediationPage";
import Topology from "@/features/topology/pages/TopologyPage";
import Admin from "@/features/admin/pages/AdminPage";
import EventUpload from "@/features/events/pages/EventUploadPage";
import UploadData from "./pages/admin/UploadData";
import RCAFlow from "./pages/demo/RCAFlow";
import Playground from "./pages/demo/Playground";
import ImpactAnalysis from "./pages/demo/ImpactAnalysis";
import RCADetailPage from "@/features/rca/pages/RcaDetailPage";
import ImpactDetailPage from "@/features/impact/pages/ImpactDetailPage";
import EventCorrelationClustersPage from "@/features/events/pages/EventCorrelationPage";
import CorrelationPage from "@/features/analytics/pages/CorrelationPage";
import KBDetailPage from "@/features/admin/pages/KBDetailPage";
import AgentsPage from "@/features/agents/pages/AgentsPage";
import NotFound from "@/shared/components/common/NotFound";

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
              <Route path="/" element={<AnalyticsDashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/rca/detail/:id" element={<RCADetailPage />} />
              <Route path="/impact/detail/:id" element={<ImpactDetailPage />} />
              <Route path="/preprocessing" element={<Preprocessing />} />
              <Route path="/clustering" element={<Clustering />} />
              <Route path="/rca-impact" element={<RCAImpact />} />
              <Route path="/remediation" element={<Remediation />} />
              <Route path="/topology" element={<Topology />} />
              <Route path="/event-correlation-clusters/:clusterId" element={<EventCorrelationClustersPage />} />
              <Route path="/correlation" element={<CorrelationPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/dashboard/alarm-prediction" element={<AlarmPredictionDashboard />} />
              <Route path="/admin/upload" element={<UploadData />} />
              <Route path="/admin/kb/:id" element={<KBDetailPage />} />
              <Route path="/upload" element={<EventUpload />} />
              <Route path="/demo/rca-flow" element={<RCAFlow />} />
              <Route path="/demo/playground" element={<Playground />} />
              <Route path="/demo/impact" element={<ImpactAnalysis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
