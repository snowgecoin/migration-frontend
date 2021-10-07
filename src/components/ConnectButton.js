import * as React from 'react';
import './ConnectButton.scss';
import CountUp from 'react-countup';
import { useEthers, useEtherBalance, useTokenBalance, useContractFunction } from "@usedapp/core";
import SnowgeCoinJSON from '../abis/SnowgeCoin.json';
import { utils } from 'ethers';
import { ChainId } from '@usedapp/core';
import { BigNumber} from "@ethersproject/bignumber";
import { Contract } from '@ethersproject/contracts'
import { formatUnits } from "@ethersproject/units";
import PuffLoader from "react-spinners/PuffLoader";
import { Checkmark } from 'react-checkmark';

const easingFn = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t * t * t + 2) + b;
};

export default function ConnectButton() {
  const SNOWGE_V1 = '0x5e9280d53f28281ce098c8f64e49f5f5dc9ea185';
  const REFLOOFINATOR_V1 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // currently just PCS until refloofinator gets deployed
  const [migrationState, setMigrationState] = React.useState(0); //0 is pre approve, 1 is approval pending, 2 is approved, 3 is migration pending, 4 is migration complete.
  const { chainId, activateBrowserWallet, account, library } = useEthers();
  const etherBalance = useEtherBalance(account);
  const oldTokenBalance = useTokenBalance(SNOWGE_V1, account);
  const SnowgeABI = [
        // balanceOf
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        },
        // decimals
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "type": "function"
        },
        //approve
        {
             "inputs":[
                {
                   "internalType":"address",
                   "name":"spender",
                   "type":"address"
                },
                {
                   "internalType":"uint256",
                   "name":"amount",
                   "type":"uint256"
                }
             ],
             "name":"approve",
             "outputs":[
                {
                   "internalType":"bool",
                   "name":"",
                   "type":"bool"
                }
             ],
             "stateMutability":"nonpayable",
             "type":"function"
        }
    ];
  const oldTokenContract = new Contract(SNOWGE_V1, SnowgeABI);
  const approveContractFunction = useContractFunction(oldTokenContract, 'approve', { transactionName: 'Approve Migration' });

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  const handleApprove = () => {
    approveContractFunction.send(REFLOOFINATOR_V1, BigNumber.from('1000000000000000000000000000000000000000000000000000'))
  }

  async function changeNetwork(){
    console.log(library);
    try {
      await library.provider.sendAsync({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    } catch (switchError) {
      console.log(switchError);
      if (switchError.code === 4902) {
        try {
          await library.providersendAsync({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38',
              rpcUrl: 'https://bsc-dataseed.binance.org/',
              chainName: 'BSC',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB', // 2-6 characters long
                decimals: 18,
              },
              blockExplorerUrl: 'https://bscscan.com',
            }]
          });
        } catch (addError) {
          console.log(addError);
        }
      }
      // handle other "switch" errors
    }
  }

  React.useEffect(() => {
    if (approveContractFunction.state.status == "Mining") {
      setMigrationState(1);
    } else if (approveContractFunction.state.status == "Success") {
      setMigrationState(2);
    } else {
      setMigrationState(0);
    }
  }, [approveContractFunction.state])


  return(<div>
    {chainId != ChainId.BSC &&
      <div>
        <p className={'balance-title'}>Switch to BSC</p>
        <button className="snowgebutton" onClick={() => changeNetwork()}>Switch Networks</button>
      </div>}
    {chainId == ChainId.BSC && (account ? (
      <div>
        <p className={'balance-title'}>Snowge Balance</p>
        <p className={'balance-number'}>{oldTokenBalance && <CountUp start={0} end={parseFloat(formatUnits(oldTokenBalance, 9))} separator={','} decimals={2} easingFn={easingFn} duration={2} suffix=" tokens"/>}</p>
        <p className={'connected'}>🟢 {account.substring(0,2) + '...' + account.substring(39)} | Connected</p>
        {migrationState == 0 && <button className="snowgebutton" onClick={handleApprove}>approve</button>}
        {migrationState == 1 && <div className="loader-container"><PuffLoader loading={true} color={"#61dafb"}/></div>}
        {migrationState == 2 && <Checkmark color={"#3C8980"}/>}
      </div>
    ) : (
      <button className="snowgebutton" onClick={handleConnectWallet}>Connect to a Wallet</button>
    ))}
  </div>);
}
