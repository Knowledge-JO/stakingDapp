const StakeBalanceInfo = () => {
    
    const stake = () => {
        const showStakeForm = document.querySelector('.stakeForm-container')
        showStakeForm.style.display = 'flex'
    }
    
    return (
        <div className="stakeBalanceInfo-container" id="stake">
            <h3>$VTC Staking</h3>
            <div className="wallet-info">
                <div className="apr data"><p>APR<br/>120%</p></div>
                <div className="total-balance data">
                    <p className="t-b">
                        Total Balance
                    </p>
                    <hr></hr>
                    <p className="t-b-i"><b>$4111</b></p>
                </div>
                <div className="balance data">
                    <p>
                        Available to $stake<br/> 
                        <b>$4111</b>
                    </p>
                    <button className="s-i-btn" onClick={stake}>Stake</button>
                </div>

                <div className="staked data">
                    <p>
                        STAKED<br/>
                        <b>$4111</b>
                    </p>
                    <button className="s-i-btn">Unstake</button>
                </div>
                <div className="Earned data">
                   <p>
                        Earned <br/>
                        $42.02
                   </p>
                   <button className="s-i-btn">Withdraw</button>
                </div>
            </div>
        </div>
    );
}
 
export default StakeBalanceInfo;