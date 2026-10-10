import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

// A temporary placeholder component for Vaishnavi's future work
function StorefrontPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-700">
      <h1 className="text-3xl font-bold mb-4">User Storefront</h1>
      <p>This is where Vaishnavi will build the customer-facing catalog!</p>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-xl tracking-wide">
        IntelliMart<span className="text-blue-400">.</span>
      </div>
      <div className="space-x-6">
        <Link
          to="/"
          className={`pb-1 ${location.pathname === "/" ? "border-b-2 border-blue-400 text-blue-400" : "hover:text-blue-300"}`}
        >
          User Storefront
        </Link>
        <Link
          to="/admin"
          className={`pb-1 ${location.pathname === "/admin" ? "border-b-2 border-blue-400 text-blue-400" : "hover:text-blue-300"}`}
        >
          Admin Panel
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<StorefrontPlaceholder />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
