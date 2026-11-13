import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import HomePage from '@/components/home/HomePage';
import RequestPage from '@/components/request/RequestPage';
import DispatchPage from '@/components/dispatch/DispatchPage';
import SimulationPage from '@/components/simulation/SimulationPage';
import { useDispatchDemo } from '@/hooks/useDispatchDemo';
import type { View } from '@/types';

function getInitialView(): View {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'request' || hash === 'dispatch' || hash === 'simulation') {
      return hash;
    }
  }
  return 'home';
}

function App() {
  const [view, setView] = useState<View>(getInitialView);
  const dispatch = useDispatchDemo();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'request' || hash === 'dispatch' || hash === 'simulation') {
        setView(hash);
      } else {
        setView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (next: View) => {
    setView(next);
    if (next === 'home') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = next;
    }
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
            onNavigate={navigate}
          />
        )}
        {view === 'simulation' && (
          <SimulationPage
            requests={dispatch.requests}
            ambulances={dispatch.ambulances}
            autoDispatch={dispatch.autoDispatch}
            onAutoDispatchChange={dispatch.setAutoDispatch}
            onAssign={dispatch.assign}
            onDecline={dispatch.decline}
            onOperatorAccept={dispatch.operatorAccept}
            onAdvanceStage={dispatch.advanceStage}
            onSubmitFeedback={dispatch.submitFeedback}
            onSpawnPresetDemo={dispatch.spawnPresetDemo}
            onSpawnServiceDemo={dispatch.spawnServiceDemo}
            onNavigate={navigate}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
