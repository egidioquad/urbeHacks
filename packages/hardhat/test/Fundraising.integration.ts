import { expect } from "chai";
import { ethers } from "hardhat";
import { Fundraising } from "../typechain-types/contracts/Fundraising.sol";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

function ethToWei(eth: number): bigint {
  return ethers.parseEther(eth.toString());
}

describe("Unit-Test", function () {
  let fundraisingContract: Fundraising;

  let accounts: HardhatEthersSigner[];
  let fundraisingOwner: HardhatEthersSigner;
  let campaignProposer: HardhatEthersSigner;
  let contributer: HardhatEthersSigner;

  const twoMonths = 60 * 60 * 24 * 30 * 2;

  // Setup testing enviroment
  before(async () => {
    accounts = await ethers.getSigners();

    // Getting signers for this test
    fundraisingOwner = accounts[0];
    campaignProposer = accounts[1];
    contributer = accounts[2];

    // Assuming stableCoin is already deployed and you have its address
    const stableCoinAddress = '0x...'; // Replace this with the actual address of the StableCoin contract
    const StableCoinFactory = await ethers.getContractFactory('StableCoin');
    const stableCoinContract = StableCoinFactory.attach(stableCoinAddress);

    // Deploy fundRaising contract
    const fundraisingFactory = await ethers.getContractFactory("Fundraising");
    fundraisingContract = await fundraisingFactory.deploy(
      stableCoinContract.getAddress(), 
      { from: fundraisingOwner.address,}
    );
    await fundraisingContract.waitForDeployment();

    // Contributer mints 10000  USDC
    
  });
});
