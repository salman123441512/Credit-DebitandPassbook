import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateUser from './Pages/CreateUser';
import CreditDebitAmount from './Pages/CreditDebitAmount';
import Customer from './Pages/Customer';
import Ticket from './Pages/Ticket';
import Setting from './Pages/Setting';

const App = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<CreateUser />} />
        <Route path="/credit-debit" element={<CreditDebitAmount />} />
        <Route path='/customer' element={<Customer/>}/>
        <Route path='/ticket' element={<Ticket/>}/>
        <Route path='/setting' element={<Setting/>}/>
      </Routes>
    </div>
  </Router>
);

export default App;
