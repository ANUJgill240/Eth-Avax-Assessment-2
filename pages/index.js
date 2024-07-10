
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import bookstore_abi from "../artifacts/contracts/BookStore.sol/BookStore.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [bookstore, setBookstore] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: 0,
    stock: 0,
  });

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const bookstoreABI = bookstore_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
      getBookstoreContract(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  const getBookstoreContract = (account) => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner(account);
    const bookstoreContract = new ethers.Contract(contractAddress, bookstoreABI, signer);

    setBookstore(bookstoreContract);
  };

  const getBalance = async () => {
    if (bookstore) {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const addBook = async () => {
    if (bookstore) {
      const { title, author, price, stock } = newBook;
      let tx = await bookstore.addBook(title, author, ethers.utils.parseEther(price.toString()), stock);
      await tx.wait();
      getBooks();
    }
  };

  const getBooks = async () => {
    if (bookstore) {
      let bookList = [];
      const nextBookId = await bookstore.nextBookId();
      for (let i = 1; i < nextBookId; i++) {
        let book = await bookstore.books(i);
        bookList.push({
          id: i,
          title: book.title,
          author: book.author,
          price: ethers.utils.formatEther(book.price),
          stock: book.stock.toNumber(),
        });
      }
      setBooks(bookList);
    }
  };

  const purchaseBook = async (bookId, price) => {
    if (bookstore) {
      let tx = await bookstore.purchaseBook(bookId, { value: ethers.utils.parseEther(price.toString()) });
      await tx.wait();
      getBooks();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to use this Bookstore.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount} className="connect-button">Connect Metamask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (books.length === 0) {
      getBooks();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div className="form-section">
          <h2>Add a New Book</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBook.title}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newBook.author}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (ETH)"
            value={newBook.price}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={newBook.stock}
            onChange={handleInputChange}
            className="input-field"
          />
          <button onClick={addBook} className="action-button">Add Book</button>
        </div>
        <h2>Available Books</h2>
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <p><strong>{book.title}</strong> by {book.author}</p>
              <p>Price: {book.price} ETH</p>
              <p>Stock: {book.stock}</p>
              <button onClick={() => purchaseBook(book.id, book.price)} className="action-button">Purchase</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Decentralized Bookstore!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
          background-color: #F4CE14;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        header {
          margin-bottom: 2rem;
        }
        .connect-button, .action-button {
          margin: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          background-color: #0070f3;
          color: #ffffff;
          border: none;
          border-radius: 5px;
        }
        .connect-button:hover, .action-button:hover {
          background-color: #005bb5;
        }
        .input-field {
          margin: 0.5rem;
          padding: 0.5rem;
          width: calc(100% - 1rem);
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .form-section {
          background-color: #ffffff;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .book-list {
          list-style-type: none;
          padding: 0;
        }
        .book-item {
          margin: 1rem 0;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}
