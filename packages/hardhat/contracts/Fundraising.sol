// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraising {
   struct Campaign {
        address creator;
        string title;
        string club;
        uint256 goalAmount;
        uint256 currentAmount;
        bool finalized;
    }

    mapping(uint256 => mapping(address => uint256)) public contributions;
    Campaign[] public campaigns;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 goalAmount);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignFinalized(uint256 indexed campaignId, address indexed creator, string title, uint256 totalAmount);

    event GoalReached(uint256 indexed campaignId);

    function createCampaign(string memory _title, string memory _club, uint256 _goalAmount) external {
       
        campaigns.push(Campaign({
            creator: msg.sender,
            title: _title,
            goalAmount: _goalAmount,
            currentAmount: 0,
            finalized: false,
            club: _club
        }));
    
        emit CampaignCreated(campaigns.length - 1, msg.sender, _title, _goalAmount);
    }

    function contribute(uint256 _campaignId) external payable {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        require(!campaigns[_campaignId].finalized, "Campaign is already finalized");
        require(msg.value > 0, "Contribution amount must be greater than 0");

        contributions[_campaignId][msg.sender] += msg.value;
        campaigns[_campaignId].currentAmount += msg.value;

        emit ContributionMade(_campaignId, msg.sender, msg.value);
          // Check if goal is met
        if (campaigns[_campaignId].currentAmount >= campaigns[_campaignId].goalAmount) {
            emit GoalReached(_campaignId); // Log that the goal is reached
            finalizeCampaign(_campaignId);
        }
    }

  function finalizeCampaign(uint256 _campaignId) internal {

    campaigns[_campaignId].finalized = true;

    emit CampaignFinalized(_campaignId, campaigns[_campaignId].creator, campaigns[_campaignId].title, campaigns[_campaignId].currentAmount);
	}

	function getCampaignCount() external view returns (uint256) {
       return campaigns.length;
  }

  function getAllCampaigns() external view returns (Campaign[] memory) {
      return campaigns;
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


    function getCampaignDetails(uint256 _campaignId) external view returns (address, string memory, uint256, uint256, bool) {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        Campaign memory campaign = campaigns[_campaignId];
        return (campaign.creator, campaign.title, campaign.goalAmount, campaign.currentAmount, campaign.finalized);
    }
}
