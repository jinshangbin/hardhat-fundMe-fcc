const hre = require("hardhat")
const {
    devlopmentChains,
    DECIMAILS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async () => {
    const { deploy, log } = hre.deployments
    const { deployer } = await hre.getNamedAccounts()
    const chainId = hre.network.config.chainId

    log("ready Deploying mocks...,chainId: " + chainId)

    if (chainId === 31337) {
        log("local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMAILS, INITIAL_ANSWER],
            log: true,
        })
        log("mocks Deployed.")
        log("-------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
