import React, { useState } from "react";
import { Contract, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import { ERC20ABI as abi } from "../../abi/ERC20ABI";

interface TransferERC20Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

const TransferERC20: React.FC<TransferERC20Props> = ({
  addressContract,
  currentAccount,
}) => {
  const [amount, setAmount] = useState<string>("100");
  const [toAddress, setToAddress] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const erc20: Contract = new ethers.Contract(addressContract, abi, signer);

    // Get the user's token balance
    const balance = await erc20.balanceOf(currentAccount);
    const transferAmount = parseEther(amount);

    // Check if the user has enough tokens to make the transfer
    if (balance.lt(transferAmount)) {
      console.log("Insufficient balance");
      return;
    }

    erc20
      .transfer(toAddress, parseEther(amount))
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`);
        tr.wait().then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        });
      })
      .catch((e: Error) => console.log(e));
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);

  const handleChangeTo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToAddress(e.target.value);

  return (
    <>
      <h3 className="text-2xl font-bold mb-2">Transfer ClassToken</h3>
      <form onSubmit={onSubmit}>
        <div className="mt-4 mb-4 flex flex-row">
          <label className="block text-gray-700 font-bold mb-2 mr-2">
            Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Amount"
            onChange={handleChangeAmount}
          />
        </div>
        <div className="mt-4 mb-4 flex flex-row">
          <label className="block text-gray-700 font-bold mb-2 mr-12">To</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="To"
            onChange={handleChangeTo}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Transfer
        </button>
      </form>
    </>
  );
};

export default TransferERC20;
