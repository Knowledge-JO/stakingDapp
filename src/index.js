import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import StakeForm from './components/StakeForm';
import './styles/skeleton.css'
import 'animate.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StakeForm></StakeForm>
    <Navbar></Navbar>
    <App />
    <Footer></Footer>
  </React.StrictMode>
);

