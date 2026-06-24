import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import InventoryPage from './pages/admin/InventoryPage';
import StudentPortal from './pages/client/StudentPortal';

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
                  <Link to="/admin" className="bg-amity-blue text-white px-6 py-3 rounded-sm font-medium hover:bg-blue-900 transition flex items-center justify-center shadow-sm">Admin Login</Link>
                  <Link to="/student" className="bg-amity-yellow text-amity-blue px-6 py-3 rounded-sm font-medium hover:bg-yellow-500 transition flex items-center justify-center shadow-sm">Student Access</Link>
                </div>
              </div>
            </main>
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard Home Placeholder</div>} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="semesters" element={<div>Semesters Placeholder</div>} />
          <Route path="batches" element={<div>Batches Placeholder</div>} />
          <Route path="reports" element={<div>Reports Placeholder</div>} />
          <Route path="settings" element={<div>Settings Placeholder</div>} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
