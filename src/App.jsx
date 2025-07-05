
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import TestResultsTable from './components/TestResultsTable';
import TestDetails from './components/TestDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>REF Test Results Dashboard</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<TestResultsTable />} />
            <Route path="/data/:dir/:filePath" element={<TestDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
