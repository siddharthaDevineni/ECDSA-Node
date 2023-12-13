const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("@noble/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "03333f69bfb714cb290ae68702ae9bd847d131354663e6bee08627b5737f63e6b5": 100,
  "0338ec70cb19f40660acefe40572d91c025720624de049b279a72c99f5b3753a6a": 50,
  "0351b568fa56adfacaf3fae3ef3febcfb91782004f257546a285e89868b57893ec": 75,
};

app.get("/balance/:address", (req, res) => {
  // Wallet requests the server to get balance of an address
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
