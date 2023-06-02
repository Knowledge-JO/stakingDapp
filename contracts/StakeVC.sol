// SPDX-License-Identifier: MIT


// VTC - 0x1684648596569c449b1fb85071a57DEaB0471840
// VAI - 0x87a2B87e13c68d911EE378708F3D34f08F77960c
// 0x7489444edDB8aB9cE19989906E58828Ec1dBE935
pragma solidity ^0.8.0;


import "./ReentrancyGuard.sol";
import "./SafeERC20.sol";
import "./IERC20.sol";
import "./PoolManager.sol";

 
contract StakeVC is ReentrancyGuard {
    
    using SafeERC20 for IERC20;
    using PoolManager for  PoolManager.PoolState;


    PoolManager.PoolState private _poolManager;

    uint256 private _totalStake; // total amount of token staked

    mapping (address => uint256 ) private _userRewardPerTokenPaid; // the reward i get for the staked token
    mapping ( address => uint256 ) private _rewards;   // rewards based off the token staked.
    mapping ( address => uint256 ) private _balances; // the balance of the user ( staked token )

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    constructor (IERC20 stakingToken_, IERC20 rewardToken_, address distributor_, uint64 duration_ ) {
        stakingToken = stakingToken_;
        rewardToken = rewardToken_;
        _poolManager.distributor = uint160(distributor_); // set the distributor in the pool manager. 
                                                            // distributor handles reward token
        _poolManager.rewardsDuration = duration_ * 1 days; // set how long we are staking for in days
    }


    modifier onlyDistributor () {
        require(msg.sender == address(_poolManager.distributor), "Not Distributor");
        _;
    }

    modifier  updateRewards(address account) {
        _poolManager.updateReward(_totalStake);

        if(account != address(0)) {
            _rewards[account] = earned(account);
            _userRewardPerTokenPaid[account] = _poolManager.rewardPerTokenStored;
        }

        _;
    }

    function totalAmountStake() external view returns(uint256) {
        return _totalStake;
    }

    function balanceOf( address account ) external  view returns(uint256) {
        return  _balances[account];
    }

    function getOwner() external view returns (address)
    {
        return address(_poolManager.distributor);
    }

    function lastTimeRewardApplicable() external view returns (uint256)
    {
        return _poolManager.lastTimeRewardApplicable();
    }

    function rewardPerToken() external view returns (uint256)
    {
        return _poolManager.rewardPerToken(_totalStake);
    }

    function getRewardForDuration() external view returns (uint256)
    {
        return _poolManager.getRewardForDuration();
    }

    function earned(address account) public view returns (uint256)
    {
        return _balances[account] * (
            _poolManager.rewardPerToken(_totalStake) - _userRewardPerTokenPaid[account]
        ) / 1e18 + _rewards[account];
    }

    function stake(uint256 _amount) external payable nonReentrant updateRewards(msg.sender)  {
        require(_amount > 0, "Stake must be greater than zero");

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        _totalStake += _amount  * 10**18;
        _balances[msg.sender] += _amount * 10**18;

        emit Staked(msg.sender, _amount);

    }


    function getReward() public payable nonReentrant updateRewards(msg.sender){
        uint256 reward = _rewards[msg.sender];

        if  ( reward > 0 ) {
            _rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
        }

        emit RewardPaid(msg.sender, reward);
    }

    function withdraw(uint256 amount) public payable nonReentrant updateRewards(msg.sender) {
        require(amount > 0, "Must be greater than zero");

        _totalStake -= amount;
        _balances[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }


    function exit() external  payable  nonReentrant {
        _poolManager.updateReward(_totalStake);

        uint256 balance = _balances[msg.sender];
        uint256 reward = earned(msg.sender);

        _userRewardPerTokenPaid[msg.sender] = _poolManager.rewardPerTokenStored;

        _balances[msg.sender] -= balance;
        _rewards[msg.sender] = 0;
        _totalStake -= balance;

        _poolManager.updateReward(_totalStake);

        if ( stakingToken == rewardToken ) {
            stakingToken.safeTransfer(msg.sender, balance);
        } else {
            stakingToken.safeTransfer(msg.sender, balance);
            rewardToken.safeTransfer(msg.sender, reward);
        }

        emit Withdrawn(msg.sender, balance);
        emit RewardPaid(msg.sender, reward);
    }


    function setDistributor(address newDistributor) external payable onlyDistributor{
        require(newDistributor != address(0), "Cannot set to zero addr");
        _poolManager.distributor = uint160(newDistributor);

        emit DistributorUpdated(newDistributor);
    }

    function depositRewardTokens(uint256 amount) external payable onlyDistributor{
        require(amount > 0, "Must be greater than zero");
        uint256 _amount = amount * 10**18;
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);

        notifyRewardAmount(_amount);
    }

    function notifyRewardAmount(uint256 reward) public payable updateRewards(address(0)) onlyDistributor {
        uint256 duration = _poolManager.rewardsDuration;

        if (block.timestamp >= _poolManager.periodFinish) {
            _poolManager.rewardRate = reward / duration;
        } else {
            uint256 remaining = _poolManager.periodFinish - block.timestamp;
            uint256 leftover = remaining * _poolManager.rewardRate; // since rewardRate was not defined, this will return zero
            _poolManager.rewardRate = (reward + leftover) / duration;// if it returns zero then it will be the same as line 160
        }

        uint256 balance = rewardToken.balanceOf(address(this));

        if (rewardToken == stakingToken) {
            balance -= _totalStake;
        }

        require(_poolManager.rewardRate <= balance / duration, "Reward too high");

        _poolManager.lastUpdateTime = uint64(block.timestamp);
        _poolManager.periodFinish = uint64(block.timestamp + duration);

        emit RewardAdded(reward);
    }


    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event DistributorUpdated(address indexed newDistributor);

}