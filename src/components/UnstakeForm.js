import { ethers } from "ethers"
import connectWallet from "./helpers/connectWallet"
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import stakeVCABI from "../ABI/stakingContractABI";
import { contractAddress, stakingContractAddress } from "../ABI/contractAddresses";
import {stakedBalance} from "./helpers/getStakedBalance"

const Unstake = () => {
    const [stakeBalance, setStakedBalance] = useState(0)
    const [unstakeStatus, setUnstakeStatus] = useState('idle')

    // call getStakedBalance with useEffect
    useEffect(() => {
        getStakedBalanceHere()
    },[])


    const removeStakeContainer = (e) => {
        if (e.target.className !== 'unstakeForm-container') return
        const removeSC = document.querySelector('.unstakeForm-container')
        removeSC.style.display = 'none'
    }

    const unstakeFormlogic = (e) => {
        e.preventDefault()
        const form = document.querySelector('.unstakeForm')
        unStakeToken(form.unstakeAmount.value)
    }

    // write a function to withdraw the stakedBalance
    const getStakedBalanceHere = async () => {
        const balance = await stakedBalance()
        setStakedBalance(balance)
    }

    // function to unstake token rewards
    const unStakeToken = async (amount) => {

        try {
        setUnstakeStatus("unStaking");

        const {signer} = await connectWallet()

        const stakingContract = new ethers.Contract(
            stakingContractAddress,
            stakeVCABI,
            signer
        );

        // Stake tokens
        const stake = await stakingContract.withdraw(amount);
        await stake.wait();
        console.log(stake);

        toast.success(`Unstaking Successful`, stake);
        setUnstakeStatus("unStaked");
        } catch (error) {
        console.log(error);
        setUnstakeStatus("error");
        toast.error(`UnStaking Failed`, error);
        }
    }

    return ( 
        <div className="unstakeForm-container" onClick={removeStakeContainer}>
            <form className="unstakeForm" onSubmit={unstakeFormlogic}>
                <div className="y-balance">
                    <p>Your Balance: {stakeBalance}</p>
                </div>
                <label>Enter Amount: </label>
                <input name="unstakeAmount" className="amount" type="number" min='1'/>
                <div className="unstake">
                    <input className="stakeButton" type="submit" value={unstakeStatus === "unStaking"? "unStaking...": "Unstake Token"}></input> 
                </div>
            </form>
        </div>
    );
}
 
export default Unstake;