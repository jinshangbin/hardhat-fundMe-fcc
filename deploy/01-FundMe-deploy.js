const { deployments, network, getNamedAccounts } = require("hardhat")
const { netWorkConfig, devlopmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log("chainId: " + chainId)
    let priceFeedAddress
    if (devlopmentChains.includes(network.name)) {
        const priceFeed = await deployments.get("MockV3Aggregator")
        priceFeedAddress = priceFeed.address
    } else {
        priceFeedAddress = netWorkConfig[chainId]["ethPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [priceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!devlopmentChains.includes(network.name)) {
        await verify(fundMe.address, [])
    }

    log("fundMe deployed.")
    log("----------------------------------------------")
}

module.exports.tags = ["all", "fundMe", "fundme", "mocks"]
