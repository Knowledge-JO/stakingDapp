import { ethers } from "ethers";
import stakeVCABI from "../../ABI/stakingContractABI"
import stakeTokenABI from "../../ABI/stakeTokenABI"
import connectWallet from "./connectWallet"
import { stakingContractAddress, contractAddress } from "../../ABI/contractAddresses";

const stakedBalance = async () => {
    try {
    const {signer, address} = await connectWallet()
    const stakingContract = new ethers.Contract(
        stakingContractAddress,
        stakeVCABI,
        signer
    );

    // Get staked tokens balance
    const balance = await stakingContract.balanceOf(address);
    // convert it to integer
    const balanceInt = Number(ethers.utils.formatUnits(balance))
    return balanceInt

    } catch (error) {
    console.log(error);
    }
}

const walletBalance = async () => {
    try {
    const {signer, address} = await connectWallet()
    const tokenContract = new ethers.Contract(
        contractAddress,
        stakeTokenABI,
        signer
    );

    // Get staked tokens balance
    const balance = await tokenContract.balanceOf(address);
    // convert it to integer
    const balanceInt = Number(ethers.utils.formatUnits(balance))
    return balanceInt

    } catch (error) {
    console.log(error);
    }
}

export {stakedBalance, walletBalance}