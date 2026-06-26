import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import InventoryPage from './pages/admin/InventoryPage';
import ReportsPage from './pages/admin/ReportsPage';
import BatchPage from './pages/admin/BatchPage';
import SemesterLabPage from './pages/admin/SemesterLabPage';
import FrontDeskPortal from './pages/admin/FrontDeskPortal';
import StudentPortal from './pages/StudentPortal';
import LoginPage from './pages/LoginPage';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Landing Routes */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-amity-gray font-sans">
            <header className="bg-amity-blue text-white shadow-md p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amity-yellow rounded-sm flex items-center justify-center font-bold text-amity-blue">LU</div>
                <h1 className="text-xl font-semibold tracking-wide">Lab Inventory System</h1>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="bg-white p-8 rounded-sm shadow-md max-w-md w-full border border-gray-200 text-center">
                <h2 className="text-2xl text-amity-blue font-bold mb-2">Welcome</h2>
                <p className="text-gray-600 mb-8">Please select your portal to continue.</p>
                <div className="flex flex-col space-y-4">
                  <Link to="/admin" className="bg-amity-blue text-white px-6 py-3 rounded-sm font-medium hover:bg-blue-900 transition flex items-center justify-center shadow-sm">Admin Dashboard</Link>
                  <Link to="/admin/front-desk" className="bg-amity-yellow text-amity-blue px-6 py-3 rounded-sm font-medium hover:bg-yellow-500 transition flex items-center justify-center shadow-sm">Lab Operations Desk</Link>
                  <Link to="/student" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-sm font-medium hover:bg-gray-200 transition flex items-center justify-center shadow-sm border border-gray-300">Student Portal</Link>
                </div>
              </div>
            </main>
          </div>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/student" element={<StudentPortal />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="semesters" element={<SemesterLabPage />} />
          <Route path="batches" element={<BatchPage />} />
          <Route path="front-desk" element={<FrontDeskPortal />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<div>Settings Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
