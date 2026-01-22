import { Link, useLocation } from 'react-router-dom';
import { FaUsersCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { FaListCheck, FaUserDoctor } from 'react-icons/fa6';
import { LuBuilding2, LuLayoutDashboard, LuLink2, LuLogOut, LuSettings } from 'react-icons/lu';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard, permission: 'view_dashboard' },
  { name: 'Symptom Review', href: '/symptoms', icon: FaListCheck, permission: 'view_symptoms'  },
  { name: 'Departments', href: '/departments', icon: LuBuilding2, permission: 'manage_departments' },
  { name: 'Doctors', href: '/doctors', icon: FaUserDoctor, permission: 'manage_doctors' },
  { name: 'Matching Rules', href: '/rules', icon: LuLink2, permission: 'manage_rules' },
  { name: 'User Settings', href: '/user-settings', icon: FaUsersCog, permission: 'manage_users' },
  { name: 'Settings', href: '/settings', icon: LuSettings, permission: 'configure_settings' },
];

function Sidebar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  const userInitial = user?.name?.trim()?.[0] ?? "?";

  // Filter navigation based on permissions
  const filteredNavigation = navigation.filter(
    (item) =>
      !item.permission || hasPermission(item.permission)
  );

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-12 w-12 items-center justify-center">
          <img src="/logo-image.png" alt="Care Path Logo" />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-sidebar-foreground">CarePath</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname == item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {user?.role ? user?.role.replace("_"," ") :  "-"}
            </p>
          </div>
          <button
            onClick={logout}
            className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Logout"
          >
            <LuLogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}


export default Sidebar