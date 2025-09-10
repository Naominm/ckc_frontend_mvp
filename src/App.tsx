import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/auth";
import CreateOrder from "./pages/createOrder";
import Profile from "./pages/profile";
import PayPalSuccess from "./pages/paypalSuccess";
import NavBar from "./components/navbar";

export default function App() {
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/paypal/success" element={<PayPalSuccess />} />
        </Routes>
      </Router>
    </>
  );
}
