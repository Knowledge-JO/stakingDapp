import { ethers } from "ethers";
import stakeVCABI from "../../ABI/stakingContractABI"
import stakeTokenABI from "../../ABI/stakeTokenABI"
import { stakingContractAddress, contractAddress } from "../../ABI/contractAddresses";

const stakedBalance = async () => {
    try {
    const {signer, address} = await checkConnection()
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
    const {signer, address} = await checkConnection()
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

const checkConnection = async () => {
    try{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        if((await provider.listAccounts()).length === 0) return
        const signer = provider.getSigner();
        const address = await signer.getAddress()
        return {signer, address};
    }catch(err){
        console.log(err)
    }
}



export {stakedBalance, walletBalance, checkConnection}