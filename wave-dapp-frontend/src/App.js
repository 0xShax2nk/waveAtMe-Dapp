
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { Toaster, toast } from "react-hot-toast";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/Waveat.json";




const getEthereumObject = () => window.ethereum;




const App = () => {


  const [currentAccount, setCurrentAccount] = useState("");

  const [allWaves, setAllWaves] = useState([]);

  const [text, settext] = useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const contractAddress = "0x26C86d1Cf837fCF5a58E6d4D32ae37ab7e472C61";

  const contractABI = abi.abi;
 

  const getAllWaves = async () => {

    const { ethereum } = window;

    try {
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllWaves method from your Smart Contract
         
        const waves = await wavePortalContract.getAllWaves();


        // We only need address, timestamp, and message in our UI so let's pick those out
         
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,           
          };
        });


        // Store our data in React State
         
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  };


  const findMetaMaskAccount = async () => {
    try {
      const ethereum = getEthereumObject();
  
      // First make sure we have access to the Ethereum object.
      
      if (!ethereum) {
        console.error("Make sure you have Metamask!");
        return null;
      }
  
      console.log("We have the Ethereum object", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        getAllWaves();

        
        return account;
      } else {
        console.error("No authorized account found");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      toast.success("Wallet Connected!");
      console.log("Connected", accounts[0]);
      getAllWaves();
      
     

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };





  const wave = async (text) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(text);
        
        setIsModalOpen(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        setIsModalOpen(false);
        settext("");
        toast.success('Yaay! Your Wave is Mined!')
        console.log("Mined", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setIsModalOpen(false);
      settext(" ");
      toast.error("Transaction Failed!");
      toast.error("You have recently waved! Try after 30 minutes");
      console.log(error);
    }
}

  
const callWave = () =>{

  wave(text);

  
}

// Listen in for emitter events!
 
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message,wc) => {
    console.log("NewWave", from, timestamp, message,wc);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
        wc:wc,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
    wavePortalContract.on("won",()=>{toast(`Hurray! You won ethers`, {
      icon: '🎉',
    });});
    
    wavePortalContract.on("lost",()=>{ toast(`Bad luck! Try next time for rewards.`, {
      icon: '😔',
    });});
   
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);






 useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
    
  }, []);


 
  
  return (

    <div className="mainContainer">

    <Toaster position="bottom-right" />

      <div className="dataContainer">
        <div className="header"> 👋 Keep Waving Fellows! </div>

        <div className="bio">
        I am Shashank and I love making new friends. If you here just wave at me buddy!
        <br/>
        <br/>
        <br/>
          {!currentAccount && (<b>Connect your Ethereum wallet and wave at me!</b> )}
          {currentAccount && (<b>Wave at me! And stand a chance to win some ethers!</b>)}

         <br/>
         <br/>
         
         {!currentAccount && (<img className = "imgi" 
         src="https://media1.giphy.com/media/aDS4z67KKaumbMVanT/200w.webp?cid=ecf05e47s6nz8o4iqjvnvw24rmx4lpbihjs2ne9d506t5vqw&rid=200w.webp&ct=g" 
         alt="Waving hand" />)}

         {currentAccount && (
          
        <textarea

         style={{outline :"none", padding:"1rem", border:"0.2rem", boxShadow: "inset 2px 2px 2px 0px #ddd"}} 
         name="" 
         id="" 
         cols="30" 
         rows="10"
         placeholder="Enter your beautiful message here!"
         value={text} 
         onChange={(event) => settext(event.target.value)}>

         </textarea>)}

         <br/>
        
        </div>


        

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            <b>Connect Wallet</b>
          </button>
        )}

       { currentAccount && (<button className="waveButton" onClick={callWave}>
          <b>Wave at Me</b> 
        </button>)}

        <Modal
        style={{overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 1,
                    
                  },content: {
                    top: '35%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    width: '60%',
                    transform: 'translate(-40%, -10%)',
                    
                  },}}
        isOpen={isModalOpen}
        // onRequestClose={() => setIsModalOpen(false)}
        >

        <p> Mining Your Wave . . . 👋</p>
        

      </Modal>

        <br />
        

        {currentAccount && (<div>
          <p>Latest Waves . . . </p>
        </div>)}



        {[...allWaves].reverse().map((wave, index) => {

          if(index<5) 
          {
          return (
            <div key={index} style={{ backgroundColor: "lightblue", marginTop: "16px", padding: "8px", borderRadius:"8px"}}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
              {/* <div>WaveCount: {wave.wcn} </div> */}

              {/* <div>{typeof(wave.wcn)}</div> */}
            
            </div>)}
        }
        
        )}
     
      </div>

    </div>


  );
}

export default App;
