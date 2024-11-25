import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import ResourceForm from './components/ResourceForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ResourceForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;