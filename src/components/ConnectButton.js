import './ConnectButton.scss';
import { useEthers, useEtherBalance } from "@usedapp/core";

export default function ConnectButton() {
  const {activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <div>
      <p className={'balance-title'}>Snowge Balance</p>
      <p className={'balance-number'}>5,000,000</p>
      <p className={'connected'}>Connected</p>
    </div>
  ) : (
    <button onClick={handleConnectWallet}>Connect to a wallet</button>
  );
}
