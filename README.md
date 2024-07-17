# Frontend Solodity contract Connection
## Description :
This Solidity smart contract implements a simple storage system where a single unsigned integer value can be stored, retrieved, and modified.
## Getting Started
- Run on Remix IDE: Use Remix for online execution.
- Create a new Solidity file: Click "+" in the left sidebar, save as .sol (e.g., MyToken.sol).
- Paste the code: Copy and paste your Solidity code into the file.
---
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract SimpleStorage {
     uint256 private storedData;

    // Function to set the value
    function set(uint256 x) public {
        storedData = x;
    }

    // Function to get the value
    function get() public view returns (uint256) {
        return storedData;
    }

    // Function to add a value to the stored data
    function add(uint256 y) public {
        storedData += y;
    }
    }


Inside the project directory, in the terminal type: npm i
Open two additional terminals in your VS code
In the second terminal type: npx hardhat node
In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
Back in the first terminal, type npm run dev to launch the front-end.
After this, the project will be running on your localhost. Typically at http://localhost:3000/
## Help
If you encounter any issues, ensure the following:

The Solidity compiler version is set correctly. The address used in function calls is valid. The balance of the address is sufficient. For additional help, use the Remix documentation or community forums.

## Author
Anuj

anujgill240@gmail.com

## License
This project is licensed under the MIT License.
