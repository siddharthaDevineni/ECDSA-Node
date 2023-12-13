import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  let message = sendAmount + "to " + recipient;
  const messageHash = sha256(utf8ToBytes(message));

  let isSigned;
  let signature;
  console.log("private key: ", privateKey);
  console.log("messageHash: ", message);
  if (privateKey) {
    // signature = secp.sign(
    //   messageHash,
    //   privateKey
    // {
    //      recovered: true,
    //    }
    // );
    address = toHex(secp256k1.getPublicKey(hexToBytes(privateKey)));
    console.log("address: ", address);
    const signature = secp256k1.sign(messageHash, hexToBytes(privateKey));
    isSigned = secp256k1.verify(signature, messageHash, address);
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input
        type="submit"
        className="button"
        value="Transfer"
        disabled={isSigned ? false : true}
        style={
          isSigned
            ? { backgroundColor: "green" }
            : { backgroundColor: "red", opacity: 0.2 }
        }
      />
    </form>
  );
}

export default Transfer;
