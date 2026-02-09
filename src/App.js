import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Revenue from './components/Revenue';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Balance from './components/Balance';
import Sidebar from './components/Sidebar';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'revenue':
        return <Revenue />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <Reports />;
      case 'balance':
        return <Balance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
