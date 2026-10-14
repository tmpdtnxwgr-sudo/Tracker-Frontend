import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreatePackage from "./pages/CreatePackage.jsx";
import AdminPackageDetails from "./pages/AdminPackageDetails.jsx";
import TrackingResults from "./pages/TrackingResults.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/packages/new" element={<CreatePackage />} />
        <Route path="/admin/packages/:id" element={<AdminPackageDetails />}/>
        <Route path="/track/:trackingNumber" element={<TrackingResults />} />
      </Routes>
    </BrowserRouter>
  );
}
