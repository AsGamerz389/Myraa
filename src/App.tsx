import React from 'react';
import { CrashGuard } from './components/CrashGuard';
import { CompanionApp } from './companion/CompanionApp';

export const App: React.FC = () => {
  return (
    <CrashGuard>
      <CompanionApp />
    </CrashGuard>
  );
};

export default App;
