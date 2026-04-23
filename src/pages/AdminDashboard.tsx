import { Routes, Route } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import ManageAgenda from '../components/admin/ManageAgenda';
import ManageReleases from '../components/admin/ManageReleases';
import ManageGallery from '../components/admin/ManageGallery';
import ManageRequests from '../components/admin/ManageRequests';
import ManageHero from '../components/admin/ManageHero';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-primary/20">
        {/* Header Info */}
        <div className="flex items-center justify-end gap-6 mb-12">
           <div className="text-right">
              <div className="text-xs font-bold tracking-widest text-foreground uppercase">{user?.displayName || 'Admin'}</div>
              <div className="text-[10px] font-medium text-primary-glow uppercase tracking-widest">Acesso Verificado</div>
           </div>
           <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
             {user?.user_metadata?.avatar_url || user?.photoURL ? <img src={user?.user_metadata?.avatar_url || user?.photoURL} alt="p" /> : <User className="h-5 w-5" />}
           </div>
        </div>

        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/hero" element={<ManageHero />} />
          <Route path="/agenda" element={<ManageAgenda />} />
          <Route path="/releases" element={<ManageReleases />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/requests" element={<ManageRequests />} />
        </Routes>
      </main>
    </div>
  );
}
