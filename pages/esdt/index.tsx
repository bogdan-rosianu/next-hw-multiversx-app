// pages/esdt.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import HwProvider from "../../hw/provider";
import { getTransport } from "../../hw/transport";
import { Transaction } from "@multiversx/sdk-core";
import { Address, TransactionPayload } from "@multiversx/sdk-core/out";

const ESDTPage = () => {
  const [formData, setFormData] = useState({
    esdtIdentifier: '',
    esdtTicker: '',
    esdtNumDecimals: '',
    esdtChainID: '',
    esdtSignature: '',
  });
  const router = useRouter();
  const [displayedData, setDisplayedData] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logMessage = (message: string) => {
    setDisplayedData(prevData => [...prevData, message]);
    console.log(message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // You can do further processing with the form data here

    const app = new HwProvider(await getTransport());
    try {
      const esdtProvisioningRes = await app.provideESDTInfo(formData.esdtTicker, formData.esdtIdentifier, parseInt(formData.esdtNumDecimals), formData.esdtChainID, formData.esdtSignature);
      logMessage(`Successfully provided info. Ticker=${formData.esdtTicker}. Identifier hex=${formData.esdtIdentifier}. Num decimals=${formData.esdtNumDecimals}. Chain ID=${formData.esdtChainID}. Signature= ${formData.esdtSignature}`);
    } catch (e) {
      logMessage(`FAIL while providing esdt info: ${e}`);
    }

    const addressHwResponse = await app.getAddress("", false);
    logMessage(`Sender address: ${addressHwResponse.address}`);
    const tokenTransferTx = new Transaction({
      nonce: 42,
      value: "1",
      sender: new Address(addressHwResponse.address),
      receiver: new Address("erd1uv40ahysflse896x4ktnh6ecx43u7cmy9wnxnvcyp7deg299a4sq6vaywa"),
      gasPrice: 1000000000,
      gasLimit: 50000,
      data: new TransactionPayload(`ESDTTransfer@${formData.esdtIdentifier}@056bc75e2d63100000`),
      chainID: formData.esdtChainID,
      version: 2,
      options: 2,
    });
    try {
      const signature = await app.signTransaction("", tokenTransferTx.serializeForSigning().toString(), true);
      logMessage(`Successfully signed the transaction. Signature: ${signature}`);
    } catch (e) {
      logMessage(`FAIL while signing the transaction: ${e}`);
    }

    // Navigate to the 'esdt' page after form submission
    router.push('/esdt');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="esdtIdentifier">Esdt identififer:</label>
          <input
            type="text"
            id="esdtIdentifier"
            name="esdtIdentifier"
            style={{width: 200}}
            value={formData.esdtIdentifier}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="esdtIdentifier">Esdt ticker:</label>
          <input
            type="text"
            id="esdtTicker"
            name="esdtTicker"
            style={{width: 100}}
            value={formData.esdtTicker}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="esdtNumDecimals">Esdt num decimals:</label>
          <input
            type="text"
            id="esdtNumDecimals"
            name="esdtNumDecimals"
            style={{width: 50}}
            value={formData.esdtNumDecimals}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="esdtChainID">Esdt chain ID:</label>
          <input
            type="text"
            id="esdtChainID"
            name="esdtChainID"
            style={{width: 50}}
            value={formData.esdtChainID}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="esdtSignature">Esdt signature:</label>
          <input
            type="text"
            id="esdtSignature"
            name="esdtSignature"
            style={{width: 900}}
            value={formData.esdtSignature}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Provide ESDT & transfer</button>
      </form>
      <div>
        <h2>Output:</h2>
        <ul>
          {displayedData.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ESDTPage;
