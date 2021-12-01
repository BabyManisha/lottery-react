import './App.css';
import {useState, useEffect} from 'react';

// Eth
import web3 from './web3';
import lottery from './lottery';

function App() {
  web3.eth.getAccounts()
    .then(console.log)

  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState({});

  useEffect(() => {
    (async() => {
      // Manager Details
      let lotteryManager = await lottery.methods.manager().call();
      setManager(lotteryManager);

      // Players Details
      let allPlayers = await lottery.methods.getPlayers().call();
      console.log(allPlayers);
      setPlayers(allPlayers);

      // Balance Details
      let bal = await web3.eth.getBalance(lottery.options.address);
      console.log(bal);
      setBalance(bal);

    })();
  }, []);

  const enterIntoLottery = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setStatus({'message': `Waiting for transaction to complete....`});

    await lottery.methods.enterLottery().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })
    setStatus({'message': `Successfully Entered into Lottery`});
  }

  const selectWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.selectWinner().send({
      from: accounts[0]
    })
    setStatus({'message': `Winner is selected!!`});
  }

  return (
    <div className="App">
      <h1>Lottery Contract!!</h1>
      <p>This Contract is managed by <b>{manager}</b>
        <br />
        There are currently {players.length} people entered,
        competing to win {balance} Wei!
        <br />
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>

      <form onSubmit={enterIntoLottery}>
        <h3>Want to try your luck?</h3>
        <div>
          <label>Amount of Ether to enter</label>
          <input type="text"
            value={value}
            onChange={(e)=> setValue(e.target.value)} />
          <button type="submit">Enter</button>
        </div>
      </form>

      <hr />
      <h2>{status.message}</h2>

      <hr />
      <h3>Select the Winner?</h3>
      <button onClick={selectWinner}>Select Winner</button>

    </div>
  );
}

export default App;
