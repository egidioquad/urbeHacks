// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FundToken is ERC20 {
    constructor() ERC20("FundToken", "FTK") {
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }
}

contract Fundraising {
    struct Campaign {
        address creator;
        string ipfs;
        string club;
        uint256 goalAmount;
        uint256 currentAmount;
        bool finalized;
        uint256 endCampaign;
    }

    mapping(uint256 => mapping(address => uint256)) public contributions;
    Campaign[] public campaigns;
    ERC20 public fundToken;
    ERC20 public stablecoin;
    address public owner;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goalAmount);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor);
    event CampaignFinalized(uint256 indexed campaignId, address indexed creator, string title, uint256 totalAmount);
    event GoalReached(uint256 indexed campaignId);
    event FundTokenTransferred(address indexed recipient, uint256 amount);

    constructor(address _stableCoin) {
        owner = msg.sender;
        fundToken = new FundToken();
        stablecoin = ERC20(_stableCoin);
    }

    function createCampaign(string memory _ipfs, string memory _club, uint256 _goalAmount, uint256 _endCampaign) external {
        campaigns.push(Campaign({
            creator: msg.sender,
            ipfs: _ipfs,
            club: _club,
            goalAmount: _goalAmount,
            currentAmount: 0,
            finalized: false,
            endCampaign: _endCampaign
        }));

        emit CampaignCreated(campaigns.length - 1, msg.sender, _ipfs, _goalAmount);
    }

    function contribute(uint256 _campaignId, uint256 contributionAmount) external payable {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        require(!campaigns[_campaignId].finalized, "Campaign is already finalized");
        require(stablecoin.balanceOf(msg.sender) >= contributionAmount, "Insufficient balance");        
        require(campaigns[_campaignId].endCampaign > block.timestamp, "The campaign has ended");

        require(stablecoin.transferFrom(msg.sender, address(this), contributionAmount), "Stablecoin transfer failed");
        campaigns[_campaignId].currentAmount += contributionAmount;
        emit ContributionMade(_campaignId, msg.sender);

        if (campaigns[_campaignId].currentAmount >= campaigns[_campaignId].goalAmount) {
            emit GoalReached(_campaignId);
            finalizeCampaign(_campaignId);
        }

        uint256 fundTokenAmount = contributionAmount / 100 * 20;
        require(fundToken.transfer(msg.sender, fundTokenAmount),"FundToken transfer failed");
        emit FundTokenTransferred(msg.sender, fundTokenAmount);
    }

    function finalizeCampaign(uint256 _campaignId) internal {
        Campaign memory campaign = campaigns[_campaignId];
        require(!campaign.finalized, "Campaign is already finalized");
        require(stablecoin.transfer(campaign.creator, campaign.currentAmount), "Stablecoin grant failed");
        campaigns[_campaignId].finalized = true;
        emit CampaignFinalized(_campaignId, msg.sender, campaign.ipfs, campaign.currentAmount);

    }

    function getAllCampaignsByClub(string memory _club) external view returns (Campaign[] memory) {
        uint256 filteredCount = 0;
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (keccak256(bytes(campaigns[i].club)) == keccak256(bytes(_club))) {
                filteredCount++;
            }
        }
    
        Campaign[] memory filteredCampaigns = new Campaign[](filteredCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (keccak256(bytes(campaigns[i].club)) == keccak256(bytes(_club))) {
                filteredCampaigns[currentIndex] = campaigns[i];
                currentIndex++;
            }
        }
        return filteredCampaigns;
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getFundToken(address test) external view returns (uint256) {
        return fundToken.balanceOf(test);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function switchStableCoin(address _newStableCoin) public {
        require(msg.sender == owner, "Only the owner can change the stable coin");
        stablecoin = ERC20(_newStableCoin);
    }

    function checkAndFinalizeCampaigns() external {
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (!campaigns[i].finalized && block.timestamp >= campaigns[i].endCampaign) {
                finalizeCampaign(i);
            }
        }
    }
}
