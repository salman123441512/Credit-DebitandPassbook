const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/financeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    accountNumber: { type: String, unique: true },
    aadharCard: String,
    totalAmount: { type: Number, default: 0 },
    transactions: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String }, // 'credit' or 'debit'
        amount: { type: Number },
        newTotalAmount: { type: Number },
      }
    ]
  });
  


const User = mongoose.model('User', userSchema);


// Create User
app.post('/api/users', async (req, res) => {
  try {
    const existingUser = await User.findOne({ accountNumber: req.body.accountNumber });
    if (existingUser) {
      return res.status(400).send({message:'Account number already exists'});
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: 'Error creating user', details: error.message });
  }
});

// Get User by Account Number
app.get('/api/users/:accountNumber', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching user', details: error.message });
  }
});
app.put('/api/users/:accountNumber/update-amount', async (req, res) => {
  console.log('Update Amount Request:', req.body); // Log request body

  try {
    const { amount, type } = req.body;
    const accountNumber = req.params.accountNumber;

    if (amount == null || type == null) {
      return res.status(400).send({ error: 'Amount and type are required' });
    }

    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).send({ error: 'Transaction amount must be a positive number' });
    }

    if (type !== 'credit' && type !== 'debit') {
      return res.status(400).send({ error: 'Invalid transaction type' });
    }

    const user = await User.findOne({ accountNumber });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    let newTotalAmount;
    if (type === 'credit') {
      newTotalAmount = user.totalAmount + amount;
    } else if (type === 'debit') {
      if (user.totalAmount < amount) {
        return res.status(400).send({ error: 'Insufficient funds for debit' });
      }
      newTotalAmount = user.totalAmount - amount;
    }

    const transaction = {
      date: new Date(), // Set the current date
      type,
      amount,
      newTotalAmount,
    };

    console.log('User Transactions Before Update:', user.transactions);
    user.totalAmount = newTotalAmount;
    user.transactions.push(transaction); // Add the transaction to the array
    console.log('User Transactions After Update:', user.transactions);

    await user.save();
    console.log('User saved successfully');

    res.send(user);

  } catch (error) {
    console.error('Error updating amount:', error);
    res.status(400).send({ error: 'Error updating amount', details: error.message });
  }
});






// Get the last 5 transactions for passbook
// Backend Route
app.get('/api/users/:accountNumber/transactions', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });

    // Check if the user exists
    if (!user) return res.status(404).send('User not found');
  
    // Check if the user has any transactions
    if (!user.transactions || user.transactions.length === 0) {
      return res.status(404).send('No transactions found for this user');
    }

    // Return the last 5 transactions
    const last5Transactions = user.transactions
    res.send(last5Transactions);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transactions', details: error.message });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
