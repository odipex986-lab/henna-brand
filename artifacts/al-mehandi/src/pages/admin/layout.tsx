import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, QrCode, LogOut, Package } from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated && location !== '/admin/login') {
    return null; // Will redirect
  }

  // If on login page, don't show sidebar
  if (location === '/admin/login') {
    return <div className="min-h-screen bg-secondary/30">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-display font-bold">
            AM
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              location === '/admin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link 
            href="/admin/qr-codes"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              location === '/admin/qr-codes' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <QrCode size={20} /> Manage QRs
          </Link>
          
          <div className="pt-8 mt-8 border-t border-border">
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Package size={20} /> View Store
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
