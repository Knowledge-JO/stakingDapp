import '../styles/App.css';
import Hero from './Hero';
import Info from './Info';
import StakeBalanceInfo from './StakeBalanceInfo';
import StakeInfo from './StakeInfo';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <div className='container'>
        <Hero></Hero>
        <Info></Info>
      </div>
      <div className='stake-info'>
        <StakeInfo></StakeInfo>
        <StakeBalanceInfo></StakeBalanceInfo>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
