import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { ethers } from "ethers";
import stakeVCABI from '../ABI/stakingContractABI'
import contractABI from '../ABI/stakeTokenABI'


const StakeForm = () => {
    const [amount, setAmount] = useState(0)
    const [approvalStatus, setApprovalStatus] = useState('idle')
    const [stakingStatus, setStakingStatus] = useState('idle')
    const contractAddress = ""
    const stakingContractAddress = ""
    const handleAmount = (event) => {
        event.preventDefault();
        setAmount(event.target.value);
    };

    const removeStakeContainer = (e) => {
        if (e.target.className !== 'stakeForm-container') return
        const removeSC = document.querySelector('.stakeForm-container')
        removeSC.style.display = 'none'
    }

    const formLogic = (e) => {
        e.preventDefault()
        if (e.target.className !== 'stakeForm') return
        const form = document.querySelector('.stakeForm')
        console.log(form.stakeAmount.value)
    }
    const approveToken = async () => {
        try {
          setApprovalStatus("approving");
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
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

    async function stakeToken() {
        try {
          setStakingStatus("staking");
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
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

    return ( 
        <div className="stakeForm-container" onClick={removeStakeContainer}>
            <form className="stakeForm" onSubmit={formLogic}>
                <div className="y-balance">
                    <p>Your Balance: $4111</p>
                </div>
                <label>Enter Amount: </label>
                <input name="stakeAmount" className="amount" type="number" min='1' onChange={handleAmount}/>
                <div className="stake"><input  className="stakeButton" type="submit" value="Approve"/></div>
            </form>
        </div>
    );
}
 
export default StakeForm;