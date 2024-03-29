import { expect } from "chai";
import { ethers } from "hardhat";
import { Fundraising } from "../typechain-types/contracts/Fundraising.sol";
import { StableCoin } from "../typechain-types/contracts/StableCoin";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

function ethToWei(eth: number): bigint {
  return ethers.parseEther(eth.toString());
}

describe("Unit-Test", function () {
  let fundraisingContract: Fundraising;
  let stableCoinContract: StableCoin;
  let stableCoinContractSubstitute: StableCoin;

  let accounts: HardhatEthersSigner[];
  let fundraisingOwner: HardhatEthersSigner;
  let campaignProposer: HardhatEthersSigner;
  let contributer: HardhatEthersSigner;

  const twoMonths = 60 * 60 * 24 * 30 * 2;

  // Setup testing enviroment with various roles and contracts
  before(async () => {
    accounts = await ethers.getSigners();

    // Getting signers for this test
    fundraisingOwner = accounts[0];
    campaignProposer = accounts[1];
    contributer = accounts[2];

    // Deploy mock stableCoin contract
    const stableCoinFactory = await ethers.getContractFactory("StableCoin");
    stableCoinContract = await stableCoinFactory.deploy();
    await stableCoinContract.waitForDeployment();

    stableCoinContractSubstitute = await stableCoinFactory.deploy();
    await stableCoinContractSubstitute.waitForDeployment();

    // Deploy mock fundRaising contract
    const fundraisingFactory = await ethers.getContractFactory("Fundraising");
    fundraisingContract = await fundraisingFactory.deploy(stableCoinContract.getAddress(), {
      from: fundraisingOwner.address,
    });
    await fundraisingContract.waitForDeployment();

    // Contributer gets for himself 10000 USDC
    await stableCoinContract.connect(contributer).mint(ethToWei(10000));
  });

  it("Should mint 1000000 FundToken to itself", async function () {
    const tokenAmount = await fundraisingContract.getFundToken(fundraisingContract.getAddress());
    const expectedTokenAmount = ethToWei(1000000);

    expect(tokenAmount).to.equal(expectedTokenAmount);
  });

  it("Should give the chance to create a campaign", async function () {
    const ipfs = "hash";
    const club = "42test";
    const goalAmount = ethToWei(100);

    const currentTime = Math.floor(Date.now() / 1000);
    const twoMonthsLater = currentTime + twoMonths; // 2 months later

    // Create the campaign
    await fundraisingContract.connect(campaignProposer).createCampaign(ipfs, club, goalAmount, twoMonthsLater);

    // Retrieve the created campaign
    const campaigns = await fundraisingContract.getCampaigns();
    const campaign = campaigns[0];

    // Test if campaign is created correctly
    expect(campaign.sender).to.equal(campaignProposer);
    expect(campaign.ipfs).to.equal(ipfs);
    expect(campaign.club).to.equal(club);
    expect(campaign.goalAmount).to.equal(goalAmount);
  });

  it("Should finalize the campaign after 2 months", async function () {
    // Get the campaign created in the previous test
    const campaigns = await fundraisingContract.getCampaigns();
    const campaign = campaigns[0];

    // Ensure the campaign was created in the previous test
    expect(campaign.sender).to.equal(campaignProposer);

    // Go forward to 2 months later
    await ethers.provider.send("evm_increaseTime", [twoMonths]);
    await ethers.provider.send("evm_mine");

    // Finalize all campaigns that have passed their deadline
    await fundraisingContract.checkAndFinalizeCampaigns();

    // Retrieve the finalized campaign
    const finalizedCampaign = await fundraisingContract.campaigns(0);

    // Expect the campaign to be finalized
    expect(finalizedCampaign.finalized).to.equal(true);

    // Try to contribute to the finalized campaign and expect it to revert
    await expect(fundraisingContract.connect(contributer).contribute(0, ethToWei(100))).to.be.revertedWith(
      "Campaign is already finalized",
    );
  });

  it("Should end campaign after reached goal", async function () {
    const ipfs = "hash";
    const club = "42test";
    const goalAmount = ethToWei(1000);

    const currentTime = Math.floor(Date.now() / 1000);
    const twoMonthsLater = currentTime + twoMonths * 100; // 2 months later

    // Create the campaign
    await fundraisingContract.connect(campaignProposer).createCampaign(ipfs, club, goalAmount, twoMonthsLater);

    // Approve the contract to allowance
    await stableCoinContract.connect(contributer).approve(fundraisingContract.getAddress(), goalAmount);

    // Contributer sends 1000 USDC
    await fundraisingContract.connect(contributer).contribute(1, goalAmount);

    // Except to revert a try to contribute to a finalized campaign
    await expect(fundraisingContract.connect(contributer).contribute(1, ethToWei(100))).to.be.revertedWith(
      "Campaign is already finalized",
    );

    const campaigns = await fundraisingContract.getCampaigns();

    // Test if campaign is finalized correctly
    expect(campaigns[0].finalized).to.equal(true);
  });

  it("Should send the USDC token to the campaign", async function () {
    // Testing if previous contribution returned 200 42-tokens to the contributor
    expect(await fundraisingContract.getFundToken(contributer)).to.equal(ethToWei(200));
  });

  it("Should give back 20% of contribution amount in 42 tokens", async function () {
    // Testing if previous contribution returned 200 42-tokens to the contributor
    expect(await fundraisingContract.getFundToken(contributer)).to.equal(ethToWei(200));
  });

  it("Should switch stable coin only from the owner", async function () {
    await expect(
      fundraisingContract.connect(contributer).switchStableCoin(stableCoinContractSubstitute.getAddress()),
    ).to.be.revertedWith("Only the owner can change the stable coin");

    expect(
      await fundraisingContract.connect(fundraisingOwner).switchStableCoin(stableCoinContractSubstitute.getAddress()),
    );
  });
});
