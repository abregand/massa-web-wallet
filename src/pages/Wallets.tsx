import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import {
  ClientFactory,
  Client,
  DefaultProviderUrls,
  CHAIN_ID,
  WalletClient,
  fromMAS
} from "@massalabs/massa-web3";

interface IWallet {
  index: string;
  address: string;
  publicKey: string;
  secretKey: string;
}

interface IBalance {
  finalBalance:number;
  candidateBalance:number;
}

const App: React.FC = () => {
  const network = DefaultProviderUrls.BUILDNET;
  const chainId = CHAIN_ID.BuildNet;
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [balances, setBalances] = useState<IBalance[]>([]);
  const [transaction, setTransaction] = useState<any>();
  const [exportWallet, setExportWallet] = useState<any>();
  const [importWallet, setImportWallet] = useState<any>();
  const to = useRef<HTMLInputElement>(null);
  const amount = useRef<HTMLInputElement>(null);
  const fees = useRef<HTMLInputElement>(null);
  const importSecretKey = useRef<HTMLInputElement>(null);

  async function createWallet() {
    const newAccount = await WalletClient.walletGenerateNewAccount();
    if(newAccount && newAccount.publicKey && newAccount.secretKey && newAccount.address){
      const newAccountArray:IWallet = {
        "index":newAccount.address.slice(-5),
        "address":newAccount.address,
        "publicKey":newAccount.publicKey,
        "secretKey":newAccount.secretKey
      }
      const addWallet = [...wallets];
      addWallet.push(newAccountArray);
      updateWallets(addWallet);
    }
  }

  function removeWallet(index:number) {
    if (window.confirm("Are you sure you want to remove this wallet?")) {
      removeWalletConfirmed(index);
    }
  }

  function removeWalletConfirmed(index:number) {
    const newWallets = [...wallets];
    newWallets.splice(index, 1);
    updateWallets(newWallets);
  }

  async function getBalance(address:string) {
    const client: Client = await ClientFactory.createDefaultClient(
      network,
      chainId,
      true
    );
    const getAddresses = await client.publicApi().getAddresses([address]);
    return getAddresses[0];
  }

  async function refreshBalance() {
    setBalances([]);
    wallets.map(async (wallet, index) => {
      const balance = await getBalance(wallet.address);
      const newBalance = {"finalBalance":parseFloat(balance.final_balance), "candidateBalance":parseFloat(balance.candidate_balance)};
      setBalances(prevBalances => {
        const updatedBalances = [...prevBalances];
        updatedBalances[index] = newBalance;
        return updatedBalances;
      });
    });
  }

  function updateWallets(updatedWallets:IWallet[]) {
    setWallets(updatedWallets);
    localStorage.setItem('wallets', JSON.stringify(updatedWallets));
  }

  function initTransaction(index:number) {
    const wallet = wallets[index];
    setTransaction(wallet);
  }

  function initExportWallet(index:number) {
    const wallet = wallets[index];
    setExportWallet(wallet);
  }

  async function sendTransaction(index:number, to:string, amount:number, fees:number) {
    const wallet = wallets[index];
    try {
      await sendTransactionOnChain(wallet, to, amount, fees);
    } catch (error) {
      setTransaction({ ...transaction, "error": error instanceof Error ? error.message : String(error) });
    }
  }

  async function sendTransactionOnChain(from:IWallet, to:string, amount:number, fees:number) {
    const baseAccount = await WalletClient.getAccountFromSecretKey(from.secretKey);
    const client = await ClientFactory.createDefaultClient(network, chainId, true, baseAccount);
    const tx = {"fee":fromMAS(fees), "amount": fromMAS(amount), "recipientAddress":to};
    const opId = await client.wallet().sendTransaction(tx);
    setTransaction({"address":from.address, "opId":opId[0]});
  }

  async function importWalletWithSecretKey(secretKey:string) {
    setImportWallet(true);
    try {
      const baseAccount = await WalletClient.getAccountFromSecretKey(secretKey);
      if(baseAccount && baseAccount.address && baseAccount.publicKey && baseAccount.secretKey) {
        const newAccountArray:IWallet = {
          "index":baseAccount.address.slice(-5),
          "address":baseAccount.address,
          "publicKey":baseAccount.publicKey,
          "secretKey":baseAccount.secretKey
        }
        const addWallet = [...wallets];
        addWallet.push(newAccountArray);
        updateWallets(addWallet);
        setImportWallet(false);
      }
    } catch (error) {
      setImportWallet({"error": error instanceof Error ? error.message : String(error)});
    }
  }

  useEffect(() => {
    const walletStorage = localStorage.getItem('wallets');
    if(walletStorage) {
      updateWallets(JSON.parse(walletStorage));
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [wallets]);

  return (
    <div>
      <h1>Manage wallets</h1>
      <div className="mt-3">
        {wallets.map((wallet, index) => (
          <div key={index} className="my-2 wallet">
            <div className="fw-bold">Wallet #{wallet.index}</div>
            <div>
              <div>{wallet.address}</div>
              <div>{balances[index] ? (balances[index].finalBalance != balances[index].candidateBalance ? balances[index].candidateBalance + " MAS (candidate)" : balances[index].finalBalance + " MAS") : '⟳'} | <a href="#" onClick={() => {setExportWallet(false); initTransaction(index)}}>Send</a> - <a href="#" onClick={() => removeWallet(index)}>Remove</a> - <a href="#" onClick={() => {setTransaction(false); initExportWallet(index)}}>Export</a></div>
              {transaction && transaction.address == wallet.address ? (
                transaction.opId ? (
                  <div>Operation: {transaction.opId}</div>
                ):(
                  <div className="card mt-2">
                    <div className="card-header fw-bold">
                      Send transaction <span className="fst-italic">(<a href="#" onClick={() => {setTransaction(false)}}>hide</a>)</span>
                    </div>
                    <div className="card-body">
                      <div className="input-group mb-2">
                        <span className="input-group-text" id="to">To</span>
                        <input type="text" className="form-control" placeholder="AU.." aria-label="To" aria-describedby="to" ref={to} />
                      </div>
                      <div className="input-group mb-2">
                        <span className="input-group-text" id="amount">Amount</span>
                        <input type="number" className="form-control" placeholder="100" aria-label="Amount" aria-describedby="amount" ref={amount} defaultValue={100} />
                        <span className="input-group-text">MAS</span>
                      </div>
                      <div className="input-group mb-2">
                        <span className="input-group-text" id="fees">Fees</span>
                        <input type="number" className="form-control" placeholder="0.01" aria-label="Fees" aria-describedby="fees" ref={fees} step={0.01} defaultValue={0.01} />
                        <span className="input-group-text">MAS</span>
                      </div>
                      <div><button className="btn btn-sm btn-danger" onClick={() => sendTransaction(index, to.current?.value || "", parseFloat(amount.current?.value || ""), parseFloat(fees.current?.value || ""))}>Send transaction</button></div>
                      {transaction.error ? (<div className="small mt-2">Error: {transaction.error}</div>): ""}
                    </div>
                  </div>
                ))
              : "" }
              {exportWallet && exportWallet.address == wallet.address ? (
                <div className="card mt-2">
                  <div className="card-header fw-bold">
                    Export wallet <span className="fst-italic">(<a href="#" onClick={() => {setExportWallet(false)}}>hide</a>)</span>
                  </div>
                  <div className="card-body">
                    <textarea className="form-control" rows={3} spellCheck="false" defaultValue={`Address: ${exportWallet.address}\nPublic key: ${exportWallet.publicKey}\nSecret key: ${exportWallet.secretKey}`} />
                  </div>
                </div>
              ) : "" }
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <button className="btn btn-sm btn-danger" onClick={refreshBalance}>Refresh balances</button>
        <button className="btn btn-sm btn-danger ms-2" onClick={createWallet}>Create new wallet</button>
        <button className="btn btn-sm btn-danger ms-2" onClick={() => setImportWallet(true)}>Import wallet</button>
        {importWallet ?
          (
            <div className="card mt-2">
              <div className="card-header fw-bold">
                Import wallet <span className="fst-italic">(<a href="#" onClick={() => {setImportWallet(false)}}>hide</a>)</span>
              </div>
              <div className="card-body">
                <div className="input-group mb-2">
                  <span className="input-group-text" id="secret-key">Secret key</span>
                  <input type="text" className="form-control" placeholder="S1.." aria-label="Secret key" aria-describedby="secret-key" ref={importSecretKey} />
                </div>
                <div><button className="btn btn-sm btn-danger" onClick={() => importWalletWithSecretKey(importSecretKey.current?.value || "")}>Import wallet</button></div>
                {importWallet.error ? (<div className="small mt-2">Error: {importWallet.error}</div>): ""}
              </div>
            </div>
          ) : ""}
      </div>
    </div>
  );
}

export default App;
