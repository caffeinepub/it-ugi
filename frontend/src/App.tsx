import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import CreativeForm from './components/CreativeForm';
import CreativeResults from './components/CreativeResults';
import PackageHistory from './components/PackageHistory';
import { generateCreativePackage, type CreativePackageData, type FormInputs } from './utils/creativeGenerator';

type AppView = 'form' | 'results' | 'history';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [creativeData, setCreativeData] = useState<CreativePackageData | null>(null);
  const [formInputs, setFormInputs] = useState<FormInputs | null>(null);

  const handleFormSubmit = (inputs: FormInputs) => {
    const generated = generateCreativePackage(inputs);
    setCreativeData(generated);
    setFormInputs(inputs);
    setCurrentView('results');
  };

  const handleNewCreative = () => {
    setCreativeData(null);
    setFormInputs(null);
    setCurrentView('form');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleSelectPackage = (pkg: CreativePackageData, inputs: FormInputs) => {
    setCreativeData(pkg);
    setFormInputs(inputs);
    setCurrentView('results');
  };

  return (
    <Layout
      currentView={currentView}
      onNewCreative={handleNewCreative}
      onViewHistory={handleViewHistory}
    >
      {currentView === 'form' && (
        <CreativeForm onSubmit={handleFormSubmit} />
      )}
      {currentView === 'results' && creativeData && formInputs && (
        <CreativeResults
          data={creativeData}
          inputs={formInputs}
          onNewCreative={handleNewCreative}
          onViewHistory={handleViewHistory}
        />
      )}
      {currentView === 'history' && (
        <PackageHistory
          onSelectPackage={handleSelectPackage}
          onNewCreative={handleNewCreative}
        />
      )}
      <Toaster richColors position="top-right" />
    </Layout>
  );
}
