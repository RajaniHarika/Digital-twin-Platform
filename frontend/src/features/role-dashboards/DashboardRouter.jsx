import Dashboard from '../dashboard/Dashboard';
import CloudDashboard from '../../components/cloud/CloudDashboard';
import BackendDashboard from './BackendDashboard';
import SreDashboard from './SreDashboard';
import ProjectManagerDashboard from './ProjectManagerDashboard';
import AdminDashboard from './AdminDashboard';
import authService from '../../services/auth';

const DashboardRouter = () => {
  const user = authService.getCurrentUser();
  const role = user?.role;

  if (role === 'Cloud Engineer') return <CloudDashboard />;
  if (role === 'Project Manager') return <ProjectManagerDashboard />;
  if (role === 'Backend Engineer') return <BackendDashboard />;
  if (role === 'Site Reliability Engineer (SRE)' || role === 'SRE Engineer') return <SreDashboard />;
  if (role === 'Admin') return <AdminDashboard />;
  return <Dashboard />;
};

export default DashboardRouter;
