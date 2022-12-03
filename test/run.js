const main = async () => {

    const [owner] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("Waveat");
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

   


    // Get Contract Balance
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    let numberOfWaves;
    numberOfWaves = await waveContract.getTotalWaves();
    console.log(numberOfWaves.toNumber());

    // for(i=1;i<=5;i++){
    //   const waveTxn = await waveContract.wave("This wave no: %d",i);
    //   await waveTxn.wait();
    // }

      let waveTxn = await waveContract.wave("A Message 1!");
      await waveTxn.wait();

      let waveTxn2 = await waveContract.wave("A Message 2!");
      await waveTxn2.wait();

      let waveTxn3 = await waveContract.wave("A Message 3!");
      await waveTxn3.wait();

      contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
      console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
      );


      let allWaves = await waveContract.getAllWaves();
      console.log(allWaves);
  
      await waveContract.getTotalWaves();

      await waveContract.numberOfWavers();

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); 
    } catch (error) {
      console.log(error);
      process.exit(1); 
    }
    
  };
  
  runMain();