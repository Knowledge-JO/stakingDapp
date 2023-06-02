import { ethers } from "ethers"
import { toast } from "react-toastify";
import { rewardContractAddress, stakingContractAddress } from "../ABI/contractAddresses";
import stakeVCABI from "../ABI/stakingContractABI";
import rewardABI from "../ABI/rewardContractABI";
import {stakedBalance, walletBalance, checkConnection} from "./helpers/getStakedBalance"
import { useState, useEffect } from "react";


const StakeBalanceInfo = () => {
    const [reward, setReward] = useState(0)
    const [stakeBalance, setStakedBalance] = useState(0)
    const [walletB, setWalletBalance] = useState(0)
    const [withdrawalStatus, setWithdrwalStatus] = useState('idle')

    // call getStakedBalance with useEffect
    useEffect(() => {
        getStakedBalanceHere()
        getwalletBalanceHere()
        setInterval(() => {earned()}, 30000)
    },[])


    const stake = () => {
        const showStakeForm = document.querySelector('.stakeForm-container')
        showStakeForm.style.display = 'flex'
    }
    const unstake = () => {
        const showStakeForm = document.querySelector('.unstakeForm-container')
        showStakeForm.style.display = 'flex'
    }

    const getReward = async () => {
        try {
        setWithdrwalStatus('withdrawing')
          const {signer} = await checkConnection()
  
          const stakingContract = new ethers.Contract(
            stakingContractAddress,
            stakeVCABI,
            signer
          );
          const getReward = await stakingContract.getReward();
          await getReward.wait();
          setWithdrwalStatus('Withdrawn')
          toast.success("Get Reward Success");
        } catch (error) {
          console.log(error);
          toast.error('Withdrawal error');
        }
    }

    const earned = async () => {
        try {
            const {signer, address} = await checkConnection()
            const stakingContract = new ethers.Contract(
                stakingContractAddress,
                stakeVCABI,
                signer
            );

            const totalearned = await stakingContract.earned(address)
            let earnedInt = (ethers.utils.formatUnits(totalearned, 18))
            earnedInt = Math.round(earnedInt)
            console.log('e',totalearned)
            setReward(earnedInt)
        }catch (err) {
            console.log(err)
        }
    }

    const getStakedBalanceHere = async () => {
        const balance = await stakedBalance()
        setStakedBalance(balance)
    }

    const getwalletBalanceHere = async () => {
        const wallet_b = await walletBalance()
        setWalletBalance(wallet_b)
    }
    
    return (
        <div className="stakeBalanceInfo-container" id="stake">
            <h3>$VTC-$VAI</h3>
            <div className="wallet-info">
                <div className="apr data"><p>APR<br/>120%</p></div>
                <div className="total-balance data">
                    <p className="t-b">
                        Total Balance
                    </p>
                    <hr></hr>
                    <p className="t-b-i"><b>{walletB + stakeBalance}</b></p>
                </div>
                <div className="balance data">
                    <p>
                        Available to $stake<br/> 
                        <b>{walletB} $VTC</b>
                    </p>
                    <button className="s-i-btn" onClick={stake}>Stake</button>
                </div>

                <div className="staked data">
                    <p>
                        Staked<br/>
                        <b>{stakeBalance} $VTC</b>
                    </p>
                    <button className="s-i-btn" onClick={unstake}>Unstake</button>
                </div>
                <div className="Earned data">
                   <p>
                        Earned <br/>
                        {reward} $VAI
                   </p>
                   <button className="s-i-btn" onClick={getReward}>{withdrawalStatus === "withdrawing"? "Withdrawing..." : "Withdraw"}</button>
                </div>
            </div>
        </div>
    );
}
 
export default StakeBalanceInfo;