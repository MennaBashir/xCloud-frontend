import { Outlet } from 'react-router-dom'
import MainNavbar from '../ui/MainNavbar';
import useMeetingStore from '@/features/meeting_app/useMeetingStore';

function MainLayout() {
  const isMeetingActive = useMeetingStore((s) => s.isMeetingActive);

  return (
    <div>
        {!isMeetingActive && <MainNavbar />}
        <Outlet />
    </div>
  )
}

export default MainLayout;