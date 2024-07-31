const netWorkConfig = {
    11155111: {
        name: "sepolia",
        ethPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    31337: {
        name: "localhost",
    },
}

const devlopmentChains = ["hardhat", "localhost"]
const DECIMAILS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    netWorkConfig,
    devlopmentChains,
    DECIMAILS,
    INITIAL_ANSWER,
}
