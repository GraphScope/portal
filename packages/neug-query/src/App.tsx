import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QueryInterface from './pages/QueryInterface';
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<QueryInterface />} />
    </Routes>
  );
};

export default App;
