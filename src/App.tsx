import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import HomePage from '@/components/home/HomePage';
import RequestPage from '@/components/request/RequestPage';
import DispatchPage from '@/components/dispatch/DispatchPage';
import { useDispatchDemo } from '@/hooks/useDispatchDemo';
import type { View } from '@/types';

function App() {
  const [view, setView] = useState<View>('home');
  const dispatch = useDispatchDemo();

  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar view={view} onNavigate={navigate} />
      <main className="flex-1">
        {view === 'home' && <HomePage onNavigate={navigate} />}
        {view === 'request' && <RequestPage onCreate={dispatch.createRequest} onNavigate={navigate} />}
        {view === 'dispatch' && (
          <DispatchPage
            loaded={dispatch.loaded}
            loadError={dispatch.loadError}
            saveError={dispatch.saveError}
            onRetry={dispatch.retryLoad}
            requests={dispatch.requests}
            ambulances={dispatch.ambulances}
            events={dispatch.events}
            autoDispatch={dispatch.autoDispatch}
            onAutoDispatchChange={dispatch.setAutoDispatch}
            feedEnabled={dispatch.feedEnabled}
            feedFinished={dispatch.feedFinished}
            onFeedEnabledChange={dispatch.setFeedEnabled}
            onAssign={dispatch.assign}
            onDecline={dispatch.decline}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
