import { useState } from "react";
import { ethers } from "ethers";


const Navbar = () => {
    const [connected, connect] = useState(false)
    const [address, setAddress] = useState("")

    window.addEventListener('load', async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        if((await provider.listAccounts()).length === 0) return
        const signer = provider.getSigner();
        const address = await signer.getAddress()
        const truncatedAddr = address.slice(0, 4) + "..." + address.slice(-3)
        connect(signer)
        setAddress(truncatedAddr)
    })

    const connect_metamask = async () => {
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
            connect(signer)
            setAddress(truncatedAddr)

            return {truncatedAddr, signer, address}
        } catch (err) {
            console.log('Error connecting to metamask: ', err)
        }
    }
    
    return (
        <div class="navbar">
            <div class="logo">Votopia Farm</div>

            <div class="connect-wallet">
                <button class="connect-wallet-btn" onClick={connect_metamask}>{connected ? address : "connect-wallet"}</button>
            </div>
        </div>
    );
}
 
export default Navbar;