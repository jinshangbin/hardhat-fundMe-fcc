//这个合约能从用户处获取资金
//能够提取资金
//同时设置一个以usd美元计价的最小资助额

// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.24;

import "contracts/ConversionRate.sol";

contract FundMe {
    using ConversionRate for uint256;

    uint256 public constant MINI_USD = 50 * 1e18;

    address[] public funders;

    mapping(address => uint256) public addressToAmountFunded;

    address private immutable i_owner;

    AggregatorV3Interface priceFeed;

    /**
     * @dev Set contract deployer as owner
     */
    constructor(address priceFeedAddress) {
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        i_owner = msg.sender;
    }

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == i_owner, "Caller is not owner");
        _;
    }

    //从用户处获取资金
    function fund() public payable {
        //获取用户资金
        require(
            msg.value.getConversionRate(priceFeed) >= MINI_USD,
            "amount < 50 usd"
        );
        //记录用户信息
        funders.push(i_owner);
        addressToAmountFunded[i_owner] = msg.value;
    }

    function withdraw() public isOwner {
        for (uint256 index = 0; index < funders.length; index++) {
            address funder = funders[index];
            addressToAmountFunded[funder] = 0;
        }

        //重置用户
        funders = new address[](0);

        //提取合约资金
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call failed");
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
