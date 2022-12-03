// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Waveat{

// State Variables

    uint totalWaves;
    uint256 private seed;

    mapping(address => uint) public waveCount;
    mapping(address => bool) inserted;
    mapping(address => uint256) public lastWavedAt;

    address[] public wavers;
    Wave[] public waves;

     event NewWave(address indexed from, uint timestamp, string message, uint256 wc);
     event won(address winner, uint prizeAmount);
     event lost(address loser);
   
    struct Wave {
        address waver; 
        string message; 
        uint256 timestamp;
        uint256 wcn; 
    }

     


   



    constructor() payable {
           
        seed = (block.timestamp + block.difficulty) % 100;
    }


    function wave(string memory _message) public {


         
        // We need to make sure the current timestamp is at least 30-minutes bigger than the last timestamp we stored
         
        require(lastWavedAt[msg.sender] + 30 minutes < block.timestamp,"Try after 30 minutes");

        // Update the current timestamp we have for the user
         
        lastWavedAt[msg.sender] = block.timestamp;


        totalWaves += 1;
        

        if(!inserted[msg.sender]){
            
            inserted[msg.sender] = true;
            waveCount[msg.sender] = 1;
            wavers.push(msg.sender);
            console.log("%s has waved! with message %s", msg.sender, _message);
            waves.push(Wave(msg.sender, _message, block.timestamp, waveCount[msg.sender]));

  
        // Generate a new seed for the next user that sends a wave
         
        seed = (block.difficulty + block.timestamp + seed) % 100;

        // console.log("Random # generated: %d", seed);

        // Give a 50% chance that the user wins the prize.
         

        if (seed < 50) {

            // console.log("%s won!", msg.sender);            
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");

            emit won(msg.sender,prizeAmount); // to capture event on frontend
            
        }else{
            emit lost(msg.sender);
        }



        emit NewWave(msg.sender, block.timestamp, _message, waveCount[msg.sender]);


        
        }else{

            waveCount[msg.sender] +=1;
           
            // console.log("%s has waved! for %d time with message: %s", msg.sender, waveCount[msg.sender], _message);
            waves.push(Wave(msg.sender, _message, block.timestamp, waveCount[msg.sender]));

        // Generate a new seed for the next user that sends a wave
         
            seed = (block.difficulty + block.timestamp + seed) % 100;

            // console.log("Random # generated: %d", seed);

    
            if (seed < 50) {
                console.log("%s won!", msg.sender);
            
                uint256 prizeAmount = 0.0001 ether;
                require(
                    prizeAmount <= address(this).balance,
                    "Trying to withdraw more money than the contract has."
                );
                (bool success, ) = (msg.sender).call{value: prizeAmount}("");
                require(success, "Failed to withdraw money from contract.");
                emit won(msg.sender,prizeAmount);
                
        }else {
            emit lost(msg.sender);
        }

          emit NewWave(msg.sender, block.timestamp, _message, waveCount[msg.sender]);

        }
    }


      function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

     function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function numberOfWavers() public view returns(uint){
        console.log("We have %d wavers", wavers.length);
        return wavers.length;
    }


}