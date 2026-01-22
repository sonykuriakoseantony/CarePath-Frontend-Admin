import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';


// Map routes to required permissions
const ROUTE_PERMISSIONS = {
  "/dashboard": "view_dashboard",
  "/departments": "manage_departments",
  "/doctors": "manage_doctors",
  "/rules": "manage_rules",
  "/user-settings": "manage_users",
  "/settings": "configure_settings",
  "/symptoms": "view_symptoms",
  "/user/:id" : "view_user"
};

function AdminLayout() {
  const { isAuthenticated, hasPermission, user } = useAuth();
   const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check route permission
  const requiredPermission = ROUTE_PERMISSIONS[location.pathname];

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to symptoms page for review specialists, dashboard for super admins
    const defaultRoute = user?.role == 'REVIEW_SPECIALIST' ? '/symptoms' : '/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout
