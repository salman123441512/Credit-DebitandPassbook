import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateUser from './Pages/CreateUser';
import CreditDebitAmount from './Pages/CreditDebitAmount';

const App = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<CreateUser />} />
        <Route path="/credit-debit" element={<CreditDebitAmount />} />
      </Routes>
    </div>
  </Router>
);

export default App;
