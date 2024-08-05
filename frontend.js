
import Head from 'next/head';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [simpleStorage, setSimpleStorage] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [storedValue, setStoredValue] = useState('');
  const [valueToSet, setValueToSet] = useState('');
  const [valueToAdd, setValueToAdd] = useState('');

  useEffect(() => {
    async function initWeb3() {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access if needed
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
        const contractABI = [
          // Replace with your contract's ABI
          {
            "inputs": [],
            "name": "get",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
              }
            ],
            "name": "set",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "y",
                "type": "uint256"
              }
            ],
            "name": "add",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ];

        const simpleStorageInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setSimpleStorage(simpleStorageInstance);
      } else {
        console.log('Please install MetaMask!');
      }
    }

    initWeb3();
  }, []);

  const handleSetValue = async () => {
    await simpleStorage.methods.set(valueToSet).send({ from: accounts[0] });
  };

  const handleAddValue = async () => {
    await simpleStorage.methods.add(valueToAdd).send({ from: accounts[0] });
  };

  const handleGetValue = async () => {
    const value = await simpleStorage.methods.get().call();
    setStoredValue(value);
  };

  return (
    <div>
      <Head>
        <title>Simple Storage DApp</title>
        <meta name="description" content="A simple storage DApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Simple Storage DApp</h1>

        <div>
          <label>
            Value to Set:
            <input
              type="text"
              id="valueToSet"
              value={valueToSet}
              onChange={(e) => setValueToSet(e.target.value)}
            />
          </label>
          <button onClick={handleSetValue}>Set Value</button>
        </div>

        <div>
          <label>
            Value to Add:
            <input
              type="text"
              id="valueToAdd"
              value={valueToAdd}
              onChange={(e) => setValueToAdd(e.target.value)}
            />
          </label>
          <button onClick={handleAddValue}>Add Value</button>
        </div>

        <div>
          <button onClick={handleGetValue}>Get Value</button>
          <p id="storedValue">Stored Value: {storedValue}</p>
        </div>
      </main>
    </div>
  );
}
