// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import { Blockchain, Transaction } from './blockchain'; 

const app = express();
const port = 3000; 

app.use(bodyParser.json());

const blockchain = new Blockchain();

// Endpoint to add a transaction
app.post('/transaction', (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    if (!fromAddress || !toAddress || !amount) {
      throw new Error('Missing required fields');
    }

    const transaction = new Transaction(fromAddress, toAddress, amount);
    blockchain.addTransaction(transaction);

    return res.status(200).json({ message: 'Transaction added successfully' });
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
});

// Endpoint to get balance
app.get('/balance/:address', (req, res) => {
  try {
    const { address } = req.params;
    const balance = blockchain.getBalance(address);

    return res.status(200).json({ balance });
  } catch (error:any) {
    return res.status(400).json({ error: error?.message });
  }
});

// Endpoint to check transaction history
app.get('/transactions/:address', (req, res) => {
  try {
    const { address } = req.params;
    const transactions = blockchain.chain
      .map((block: any) => block.transaction)
      .filter((transaction: any) => transaction.fromAddress === address || transaction.toAddress === address);

    return res.status(200).json({ transactions });
  } catch (error:any) {
    return res.status(400).json({ error: error?.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
