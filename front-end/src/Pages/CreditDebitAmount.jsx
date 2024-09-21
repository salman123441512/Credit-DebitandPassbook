import React, { useState } from 'react';
import { getUserByAccountNumber, updateAmount } from '../Services/api';
import Passbook from './Passbook'; // Import the Passbook component

const CreditDebitAmount = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');

  const handleSearch = async () => {
    try {
      const response = await getUserByAccountNumber(accountNumber);
      setUser(response.data);
    } catch (error) {
      alert('User not found');
    }
  };

  const handleUpdateAmount = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      alert("Please enter a valid amount");
      return;
    }

    if (!user || !user.accountNumber) {
      alert("Please search for a user first");
      return;
    }

    try {
      await updateAmount(user.accountNumber, {
        amount: parseFloat(amount),
        type: transactionType
      });

      alert('Amount updated successfully', amount);
      setAmount(''); // Clear the input field after updating

      handleSearch(); // Refresh user data after the amount is updated
    } catch (error) {
      console.error(error);
      alert('Error updating amount');
    }
  };

  return (
    <>
      <div className="container-fluid   mt-3">
        <h2>Credit/Debit Amount</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <div className="search-user">
        <button className="btn btn-primary  mt-2" style={{width:"30%"}} onClick={handleSearch}>Search User</button>
        </div>

        {user && (
          <div className="container-fluid mt-3" style={{ border: "2px solid blue", borderRadius: "10px" }}>
            <div className="row">
              <div className="col-md-6">
                <div className="row mt-3">
                  <div className="col-md-6 text-center">
                    <img src={user.image} alt="" style={{ height: "110px", width: "110px", border: "2px solid green", borderRadius: "50%" }} />
                  </div>
                  <div className="col-md-6">
                    <h4 className="mt-3">{user.name}</h4>
                    <p>
                      A/C : {user.accountNumber}
                    </p>
                    <p>
                      <i className="bi bi-envelope"></i> : {user.email}
                    </p>
                    <p>
                      <i className="bi bi-telephone"></i> : {user.phone}
                    </p>
                    <p>
                      <i className="bi bi-currency-rupee"></i> : <b>{user.totalAmount}</b>
                    </p>
                  </div>

                </div>

              </div>
              <div className="col-md-6 text-center">
                <h4 className="mt-2">Update Amount</h4>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <select onChange={(e) => setTransactionType(e.target.value)} className="form-control mb-2">
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <button className="btn btn-success form-control mt-1 mb-3" onClick={handleUpdateAmount}>Update Amount</button>
              </div>
            </div>

            <Passbook accountNumber={user.accountNumber} />
          </div>
        )}
      </div>
    </>
  );
};

export default CreditDebitAmount;
