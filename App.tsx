
import React, { useState, useEffect } from 'react';
import DesktopView from './components/DesktopView';
import MobileController from './components/MobileController';

const App: React.FC = () => {
  const [view, setView] = useState<'desktop' | 'remote'>('desktop');
  const [remoteId, setRemoteId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/remote/')) {
        const id = hash.replace('#/remote/', '');
        setRemoteId(id);
        setView('remote');
      } else {
        setView('desktop');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (view === 'remote' && remoteId) {
    return <MobileController targetId={remoteId} />;
  }

  return <DesktopView />;
};

export default App;
