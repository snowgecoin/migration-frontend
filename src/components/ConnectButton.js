import * as React from 'react';
import './ConnectButton.scss';
import CountUp from 'react-countup';
import { useEthers, useEtherBalance, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";

export default function ConnectButton() {
  const SNOWGE_V1 = '0x5e9280d53f28281ce098c8f64e49f5f5dc9ea185';
  const {activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const oldTokenBalance = useTokenBalance(SNOWGE_V1, account);
  const [snowgeBalance, setSnowgeBalance] = React.useState(5000000);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  function updateSnowgeBalance() {
    console.log(formatUnits(oldTokenBalance, 9));
    console.log(snowgeBalance);
    setSnowgeBalance(formatUnits(oldTokenBalance, 9));
  }

  return account ? (
    <div>
      <p className={'balance-title'}>Snowge Balance</p>
      <p className={'balance-number'}><CountUp start={0} end={snowgeBalance} separator=',' decimals={4} suffix=" tokens"/></p>
      <p className={'connected'}>Connected</p>
      <button className="snowgebutton" onClick={updateSnowgeBalance}>refresh</button>
    </div>
  ) : (
    <button className="snowgebutton" onClick={handleConnectWallet}>Connect to a Wallet</button>
  );
}
