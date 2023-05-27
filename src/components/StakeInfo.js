import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const StakeInfo = () => {
    return ( 
        <div className="stakeInfo-container">
            <h3>Staking Info</h3>
            <div className="stakeInfo-cards">
                <div className="stakeInfo-card si-card-1">
                    Rewards <br/>
                    13.16%
                </div>
                <div className="stakeInfo-card si-card-2">
                    Lock-Up <br/>
                    30Days
                </div>
                <div className="stakeInfo-card si-card-3">
                    Slashing <br/>
                    3.16%
                </div>
                <div className="stakeInfo-card si-card-4">
                    Exchanges <br/>
                    4
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
}
 
export default StakeInfo;