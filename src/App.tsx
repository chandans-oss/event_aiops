import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/errorBoundary";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Events from "./pages/Events";
import Preprocessing from "./pages/Preprocessing";
import Clustering from "./pages/Clustering";
import RCAImpact from "./pages/RCAImpact";
import Remediation from "./pages/Remediation";
import Topology from "./pages/Topology";
import Admin from "./pages/Admin";
import EventUpload from "./pages/EventUpload";
import UploadData from "./pages/admin/UploadData";
import RCAFlow from "./pages/demo/RCAFlow";
import Playground from "./pages/demo/Playground";
import ImpactAnalysis from "./pages/demo/ImpactAnalysis";
import RCADetailPage from "./pages/RCADetailPage";
import ImpactDetailPage from "./pages/ImpactDetailPage";
import EventCorrelationClustersPage from "./pages/EventCorrelationClustersPage";
import NotFound from "./pages/NotFound";

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
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/upload" element={<UploadData />} />
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
