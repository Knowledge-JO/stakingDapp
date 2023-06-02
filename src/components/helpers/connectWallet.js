import { ethers } from "ethers"

export default ( async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const chainID = await signer.getChainId();
        if( chainID !== 80001 ){
            try{
                await provider.send("wallet_switchEthereumChain", [{ chainId: `0x13881` },]);
            } catch (err) {
                console.log("Error requesting account switch: ", err)
                return;
            }
        }
        
        const address = await signer.getAddress();
        const truncatedAddr = address.slice(0, 4) + "..." + address.slice(-3)
        return {truncatedAddr, signer, address}
    } catch (err) {
        console.log('Error connecting to metamask: ', err)
    }
})

