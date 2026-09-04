import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./context/LangContext";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MarketplacePage from "./pages/MarketplacePage";
import FarmerDashboard from "./pages/FarmerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import ChatPage from "./pages/ChatPage";
import MarketTrendsPage from "./pages/MarketTrendsPage";
import TransportPage from "./pages/TransportPage";

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/agriculteur" element={<FarmerDashboard />} />
              <Route path="/agriculteur/*" element={<FarmerDashboard />} />
              <Route path="/commercant" element={<MerchantDashboard />} />
              <Route path="/commercant/*" element={<MerchantDashboard />} />
              <Route path="/transporteur" element={<TransporterDashboard />} />
              <Route path="/transporteur/*" element={<TransporterDashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/tendances" element={<MarketTrendsPage />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </LangProvider>
  );
}

export default App;
