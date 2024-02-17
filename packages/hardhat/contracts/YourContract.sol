// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    mapping(address => uint256) public contributions;
    address public owner;
    uint256 public goal;
    uint256 public endTime;
    bool public goalReached;
    bool public ended;

    event Contribution(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalAmountRaised);
    event EndTimeExtended(uint256 newEndTime);
    event Withdrawal(address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyEnded() {
        require(ended, "Campaign has not ended yet");
        _;
    }

    constructor(uint256 _goal, uint256 _duration) {
        owner = msg.sender;
        goal = _goal;
        endTime = block.timestamp + _duration;
    }

    function contribute() external payable {
        require(!ended, "Campaign has already ended");
        require(block.timestamp < endTime, "Campaign has ended");
        
        contributions[msg.sender] += msg.value;
        emit Contribution(msg.sender, msg.value);

        if (address(this).balance >= goal) {
            goalReached = true;
            emit GoalReached(address(this).balance);
        }
    }

    function withdraw() external onlyOwner onlyEnded {
        require(goalReached, "Goal has not been reached");
        
        uint256 balanceToSend = address(this).balance;
        payable(owner).transfer(balanceToSend);
        emit Withdrawal(owner, balanceToSend);
    }

    function extendDuration(uint256 _additionalSeconds) external onlyOwner {
        require(!ended, "Campaign has already ended");
        
        endTime += _additionalSeconds;
        emit EndTimeExtended(endTime);
    }

    function endCampaign() external onlyOwner {
        require(!ended, "Campaign has already ended");

        ended = true;
        if (address(this).balance >= goal) {
            goalReached = true;
            emit GoalReached(address(this).balance);
        }
    }
}
