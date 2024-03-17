import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Unit-Test", function () {
  async function deployContract() {
    const accounts = await ethers.getSigners();

    const stableCoinFactory = await ethers.getContractFactory("StableCoin");
    const stableCoinContract = await stableCoinFactory.deploy();

    await stableCoinContract.waitForDeployment();

    const fundraisingFactory = await ethers.getContractFactory("Fundraising");
    const fundraisingContract = await fundraisingFactory.deploy(stableCoinContract.getAddress());

    await fundraisingContract.waitForDeployment();

    return { stableCoinContract, fundraisingContract, accounts };
  }

  it("Should mint 1000000 FundToken to itself", async function () {
    const { fundraisingContract } = await loadFixture(deployContract);
    
    // Call the getFundToken function to retrieve the token balance of the contract address
    const tokenAmount = await fundraisingContract.getFundToken(fundraisingContract.getAddress());
    
    // Convert the expected token amount to BigInt with 18 decimal places
    const expectedTokenAmount = BigInt(1000000) * BigInt(10 ** 18);
    
    // Log the actual token amount for debugging purposes
    console.log(tokenAmount.toString());
    
    // Assert that the actual token amount matches the expected token amount
    expect(tokenAmount).to.equal(expectedTokenAmount);
  });

  it("Should create a campaign", async function () {
    const { fundraisingContract, accounts } = await loadFixture(deployContract);
    const ipfs = "hash";
    const club = "42book";
    const goalAmount = BigInt(100) * BigInt(10 ** 18);
  
    // Get 1 month to contribute
    const currentTime = new Date(0); // Unix Epoch time
    currentTime.setMonth(currentTime.getMonth() + 1); // Add 1 month
    const endCampaign = Math.floor(currentTime.getTime() / 1000);
  
    await fundraisingContract.createCampaign(ipfs, club, goalAmount, endCampaign);
  
    const campaign = await fundraisingContract.campaigns(0);
    expect(campaign.creator).to.equal(accounts[2].address); // Check if campaign is created by accounts[2]
    expect(campaign.ipfs).to.equal(ipfs);
    expect(campaign.club).to.equal(club);
    expect(campaign.goalAmount).to.equal(goalAmount);
  });
  
  it("Should be not")

});