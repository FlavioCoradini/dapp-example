import React, { useState, useEffect, PropsWithChildren } from "react";
import { ethers } from "ethers";
import { ERC20ABI as abi } from "../../abi/ERC20ABI";

interface ReadERC20Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

const ReadERC20: React.FC<ReadERC20Props> = ({
  addressContract,
  currentAccount,
}) => {
  const [totalSupply, setTotalSupply] = useState<string>();
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<number | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryTokenBalance = async (window: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    erc20
      .balanceOf(currentAccount)
      .then((result: string) => {
        setBalance(Number(ethers.utils.formatEther(result)));
      })
      .catch("error", console.error);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    erc20
      .symbol()
      .then((result: string) => {
        setSymbol(result);
      })
      .catch("error", console.error);

    erc20
      .totalSupply()
      .then((result: string) => {
        setTotalSupply(ethers.utils.formatEther(result));
      })
      .catch("error", console.error);
  }, [addressContract, currentAccount]);

  useEffect(() => {
    if (!window.ethereum) return;
    if (!currentAccount) return;

    queryTokenBalance(window);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(addressContract, abi, provider);

    console.log(`listening for Transfer...`);

    const fromMe = erc20.filters.Transfer(currentAccount, null);
    provider.on(fromMe, (from, to, amount, event) => {
      console.log("Transfer|sent", { from, to, amount, event });
      queryTokenBalance(window);
    });

    const toMe = erc20.filters.Transfer(null, currentAccount);
    provider.on(toMe, (from, to, amount, event) => {
      console.log("Transfer|received", { from, to, amount, event });
      queryTokenBalance(window);
    });

    // clean up
    // removing events on unmount in order to prevent memory leak
    return () => {
      provider.removeAllListeners(toMe);
      provider.removeAllListeners(fromMe);
    };
  }, [addressContract, currentAccount, queryTokenBalance]);

  return (
    <>
      <h3 className="text-2xl font-bold mb-2">React ClassToken info</h3>
      <p>ERC20 Contract Info: {addressContract}</p>
      <p>Token supply: {totalSupply}</p>
      <p className="mt-5">
        ClassToken in current account: {balance} {symbol}
      </p>
    </>
  );
};

export default ReadERC20;
