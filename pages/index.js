window.addEventListener('load', async () => {
    // Check if Web3 has been injected by the browser (MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request account access if needed
    } else {
        console.log('Please install MetaMask!');
        return;
    }

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

    const simpleStorage = new web3.eth.Contract(contractABI, contractAddress);
    
    window.setValue = async () => {
        const accounts = await web3.eth.getAccounts();
        const value = document.getElementById('valueToSet').value;
        await simpleStorage.methods.set(value).send({ from: accounts[0] });
    };

    window.addValue = async () => {
        const accounts = await web3.eth.getAccounts();
        const value = document.getElementById('valueToAdd').value;
        await simpleStorage.methods.add(value).send({ from: accounts[0] });
    };

    window.getValue = async () => {
        const value = await simpleStorage.methods.get().call();
        document.getElementById('storedValue').innerText = value;
    };
});
