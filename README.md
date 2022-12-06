# waveAtMe-Dapp :wave:
<p>The frontend of this Dapp is built using ReactJS and pure CSS and backend is powered by smart contracts written in solidity programming language. The smart contracts are deployed to the goerli testnet and the frontend is deployed to <a href="https://surge.sh/">Surge</a>.</p>


### Guide to install project on local machine : 

- <p>To run this project on your machine you first need to clone repo to your local machine</p> 
```
  git clone https://github.com/0xShax2nk/waveAtMe-Dapp.git
```

- <p> Change directory to WaveAtMe-Dapp and install project dependencies</p>
 ```
  cd WaveAtMe-Dapp
  npm run install
 ```
  
<p>Now that we have installed the project on the local machine let's deploy the smart contract to the testnet using <a href="https://www.quicknode.com/">Quicknode</a>'s API service and deploy frontend to the <a href="https://surge.sh/">Surge<a> so that a user can interact with our smart contracts. </p>

### Why Quicknode?
<p>Whenever we perform any operation on the blockchain like sending funds, updating state variables, or even deploying a smart contract, everything is considered as a transaction. Remember the blockchain is a decentralized ledger and not run by a central authority, it is run by the network where a bunch of nodes are connected to each other which we called a peer-to-peer network. Some of these nodes are miners who verify and add transactions to the blockchain. So when we deploy our smart contract on the blockchain we need to broadcast the transaction so that miners can mine the transaction and add it to the blockchain as a legit transaction. And that's where <a href="https://www.quicknode.com/">Quicknode</a> comes in handy, it helps us to broadcast a contract creation transaction. </p>

### Guide to Create Quicknode account and get api key :

- Create quicknode account by filling necessary information <a href="https://www.quicknode.com/">here</a>.
- Verfiy account through an email and head over to dashboard.
- You will see endpoints on sidemenu, click on create an endpoint.
- Now you will see options to select a chain, select ethereum.
- Once you select chain next select goerli as a network and click continue.
- Continue with the free plan and click create. Our job is done here!
- You will see HTTP provider and WSS provider links on dashboard and that's what we want.

> Note: I have chose goerli network for this project you can chose by your own but remember if you chose mainnet it will cost real money(ETH).



Now that we have all set with quicknode let's deploy our smart contracts to testnet. But for deploying smart contracts to testnet we need some fake ethers. Go to the <a href="https://goerlifaucet.com/?utm_source=buildspace.so&utm_medium=buildspace_project">Goerli Official Faucet</a> and claim the fake ethers. Now we are all ready to deploy our smart contract, let's do it then.

> Note: Make sure you claim fake ethers according to the testnet you have chosen.

### Guide to deploy smart contracts :

- In root folder of project, create a .env file and update the varibles 
- Update STAGING_QUICKNODE_KEY to your HTTP provider you get from quicknode and PRIVATE_KEY to the private key of your metamask wallet for the account from which you want to deploy the contract(update in .env file not in hardhat.config.js)
- Your .env file should look like this
```
    STAGING_QUICKNODE_KEY = REPLACE_WITH_ACTUAL_QUICKNODE_URL
    PRIVATE_KEY = REPLACE_WITH_YOUR_METAMAST_PRIVATE_KEY
``` 
- Now we are all set up to deploy our contract, let's deploy using deploy script
```
npx hardhat run scripts/deploy.js --network goerli
```
- Hola! your smart contract is deployded to the testnet. Copy the address of the deployed smart contract and save it somewhere. We need that address to interact with deployed smart contract from frontend.

 > Note: You can view transaction for deployed contract on <a href="https://goerli.etherscan.io/">Etherscan<a> by pasting the address of deployed smart contract

