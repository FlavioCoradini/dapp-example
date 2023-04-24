import React, { useState, useEffect, PropsWithChildren } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import Card from "./components/Card";
import ReadERC20 from "./components/ReadERC20";
import TransferERC20 from "./components/TransferERC20";

/**
 * My application require the following:
 * Set up Hardhat for create the network
 * Add the smart contract tp the project
 * Connect to Contract
 * Connect to Wallet
 */

declare let window: any;

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chainname, setChainName] = useState<string | undefined>();

  useEffect(() => {
    // @ts-ignore
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;
    //client side code
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(currentAccount).then((result: any) => {
      setBalance(ethers.utils.formatEther(result));
    });
    provider.getNetwork().then((result: any) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount]);

  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }

    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send("eth_requestAccounts", [])
      .then((accounts: any) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e: any) => console.log(e));
  };

  const onClickDisconnect = () => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };

  const isConnected = !!currentAccount;

  return (
    <div className="flex grow flex-col  p-24">
      <h1 className="text-4xl font-bold mb-3">Explore Web3</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 my-10 rounded text-xl"
        onClick={isConnected ? onClickDisconnect : onClickConnect}
      >
        {isConnected ? `Disconnect: ${currentAccount}` : "Connect"}
      </button>

      <Card>
        <ReadERC20
          addressContract={"0x5fbdb2315678afecb367f032d93f642f64180aa3"}
          currentAccount={currentAccount}
        />
      </Card>

      <Card>
        <TransferERC20
          addressContract={"0x5fbdb2315678afecb367f032d93f642f64180aa3"}
          currentAccount={currentAccount}
        />
      </Card>
    </div>
  );
};

export default Home;
