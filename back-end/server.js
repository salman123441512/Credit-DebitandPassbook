const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer
const path = require('path'); // For handling file paths

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve the uploads folder statically

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/financeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed'));
    }
  }
});

// User schema definition
const userSchema = new mongoose.Schema({
  name: { required: [true, 'User Name is required'], type: String },
  email: { required: [true, 'Email is required'], type: String, unique: [true, 'This Email already exists'] },
  password: { type: String, required: [true, 'Password is required'] },
  phone: { type: String, required: [true, 'Phone No. is required'], unique: [true, 'This Number already exists'] },
  role: { type: String, default: 'buyer' },
  address: { type: String, default: '' },
  date: { type: String, default: Date.now },
  image: { type: String, default: '' },
  otp: { type: Number },
  accountNumber: { type: String, unique: true },
  aadharCard: String,
  panCard: String,
  totalAmount: { type: Number, default: 0 },
  transactions: [
    {
      date: { type: Date, default: Date.now },
      type: { type: String }, // 'credit' or 'debit'
      amount: { type: Number },
      newTotalAmount: { type: Number }
    }
  ]
});

const User = mongoose.model('User', userSchema);

// Generate a new sequential account number
const generateAccountNumber = async () => {
  const lastUser = await User.findOne().sort({ accountNumber: -1 });
  const lastAccountNumber = lastUser ? parseInt(lastUser.accountNumber) : 1000;
  return (lastAccountNumber + 1  ).toString();
};

// Create User with automatically generated account number and password
app.post('/api/users', upload.single('image'), async (req, res) => {
  try {
    const accountNumber = await generateAccountNumber();

    const userData = {
      ...req.body,
      accountNumber, // Generated account number
      password: accountNumber, // Using the account number as the password
      image: req.file ? `/uploads/${req.file.filename}` : '' // Save image path if uploaded
    };

    const user = new User(userData);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: 'Error creating user', details: error.message });
  }
});

// GET ALL USERS FOR DATA TABLE 
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    if (allUsers) {
      res.send(allUsers);
    } else {
      res.status(404).send('Users not found');
    }
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users', details: error.message });
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

// Update Amount for User (Credit/Debit)
app.put('/api/users/:accountNumber/update-amount', async (req, res) => {
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
      date: new Date(),
      type,
      amount,
      newTotalAmount
    };

    user.totalAmount = newTotalAmount;
    user.transactions.push(transaction);

    await user.save();
    res.send(user);

  } catch (error) {
    res.status(400).send({ error: 'Error updating amount', details: error.message });
  }
});

// Get last 5 transactions for passbook
app.get('/api/users/:accountNumber/transactions', async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber });

    if (!user) return res.status(404).send('User not found');
    if (!user.transactions || user.transactions.length === 0) {
      return res.status(404).send('No transactions found for this user');
    }

    const last5Transactions = user.transactions;
    res.send(last5Transactions);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transactions', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
