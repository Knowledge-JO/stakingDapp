import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import connectWallet from "./helpers/connectWallet"
import stakeVCABI from '../ABI/stakingContractABI'
import contractABI from '../ABI/stakeTokenABI'
import {walletBalance, checkConnection} from "./helpers/getStakedBalance"
import { contractAddress, stakingContractAddress } from "../ABI/contractAddresses";

const StakeForm = () => {
    // const [amount, setAmount] = useState(0)
    const [approvalStatus, setApprovalStatus] = useState('idle')
    const [stakingStatus, setStakingStatus] = useState('idle')
    const [walletB, setWalletBalance] = useState(0)

    useEffect(() => {
      getwalletBalanceHere()
    }, [])

    const removeStakeContainer = (e) => {
        if (e.target.className !== 'stakeForm-container') return
        const removeSC = document.querySelector('.stakeForm-container')
        removeSC.style.display = 'none'
    }

    const formLogic = (e) => {
        e.preventDefault()
        if (e.target.className !== 'stakeForm') return
        const form = document.querySelector('.stakeForm')
        // setAmount(form.stakeAmount.value)
        let amount = ethers.utils.parseUnits(form.stakeAmount.value, 18)
        console.log(amount)
        if (approvalStatus === "approved"){
          stakeToken(amount)
        }else{
          approveToken(amount)
        }
    }
    const approveToken = async (amount) => {
        try {
          setApprovalStatus("approving");

          const {signer} = await connectWallet()

          const ERC20 = new ethers.Contract(contractAddress, contractABI, signer);
    
          // Approve tokens for spending
          
          const approveERC20 = await ERC20.approve(stakingContractAddress, amount);
          await approveERC20.wait();
    
          setApprovalStatus("approved");
          toast.success("Approval Successful");
        } catch (error) {
          console.log(error);
          setApprovalStatus("error");
          toast.error("Approval failed");
        }
    }

    async function stakeToken(amount) {
        try {
          setStakingStatus("staking");

          const {signer} = await connectWallet()

          const stakingContract = new ethers.Contract(
            stakingContractAddress,
            stakeVCABI,
            signer
          );
    
          // Stake tokens
          const stake = await stakingContract.stake(amount);
          await stake.wait();
          console.log(stake);
    
          setStakingStatus("staked");
          toast.success("Staking Successful");
        } catch (error) {
          console.log(error);
          setStakingStatus("error");
          toast.error("Staking failed");
        }
    }

    const getwalletBalanceHere = async () => {
      const wallet_b = await walletBalance()
      setWalletBalance(wallet_b)
    }


    return ( 
        <div className="stakeForm-container" onClick={removeStakeContainer}>
            <form className="stakeForm" onSubmit={formLogic}>
                <div className="y-balance">
                    <p>Your Balance: {walletB} </p>
                </div>
                {/* <label>Enter Amount: </label> */}
                <input name="stakeAmount" placeholder="Enter Amount" className="amount" type="number" min='1'/>
                <div className="stake">
                  { approvalStatus === "approved" ? (
                    <input className="stakeButton" type="submit" value={stakingStatus === "staking" ? "Staking..." : "Stake Token"}></input> 

                  ):(<input className="stakeButton" type="submit" value={approvalStatus === "approving" ? "Approving..." : "Approve Token"}></input>)}
                </div>
                
            </form>
        </div>
    );
}
 
export default StakeForm;