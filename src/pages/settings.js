import { AuthGuard } from '../components/authentication/auth-guard';
import { DashboardLayout } from '../components/dashboard/dashboard-layout';
import AdminSettings from '../components/settings/AdminSettings';
import TeacherSettings from '../components/settings/TeacherSettings';
import StudentSettings from '../components/settings/StudentSettings';
import {useAuth} from "../hooks/use-auth.js";


const Settings = () => {
    const { user } = useAuth();
    
    let SettingsComponent;
    switch (user.status) {
      case 'Administrator':
        SettingsComponent = AdminSettings;
        break;
      case 'Teacher':
        SettingsComponent = TeacherSettings;
        break;
      case 'Student':
        SettingsComponent = StudentSettings;
        break;
      default:
        // Default component or null if no role is matched
        SettingsComponent = null;
    }
  
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
        {SettingsComponent && <SettingsComponent />}
      </div>
    );
  };

Settings.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Settings;
