import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex, hexToBytes } from "ethereum-cryptography/utils.js";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(hexToBytes(privateKey)));
    console.log("address: ", address);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder="Enter your valid private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div className="address">Address: {address.slice(0, 10)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
