const { ethers, deployments, network, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", function () {
    let fundMe, deployer
    const sendValue = ethers.utils.parseEther("1")
    //测试FundMe的前置准备工作
    beforeEach(async function () {
        console.log("开始准备fundme的前置准备工作")
        //部署fundme合约
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    describe("fund", function () {
        console.log("fund is starting....")

        it("假设用户捐赠金额小于50美金", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "您需要支付大于50美金等额的ETH"
            )
        })

        it("用户捐赠1eth:fundOne", async function () {
            const transactionRes = await fundMe.fund({ value: sendValue })
            await transactionRes.wait(1)
            const res = await fundMe.addressToAmountFunded(deployer)

            const contractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            console.log(
                "contract address: " +
                    fundMe.address +
                    " contract balance: " +
                    contractBalance
            )

            const deployerBalance = await fundMe.provider.getBalance(deployer)
            console.log(
                "depolyer address: " +
                    deployer +
                    " depolyer balance: " +
                    deployerBalance
            )
            assert.equal(res.toString(), sendValue.toString())
        })

        it("多个用户捐赠1eth:moreFund", async () => {
            const accounts = await ethers.getSigners()
            for (i = 1; i < 7; i++) {
                const connectFundMeContract = await fundMe.connect(accounts[i])
                const transactionRes = connectFundMeContract.fund({
                    value: sendValue,
                })
                const contractBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                console.log(
                    "contract address: " +
                        fundMe.address +
                        " contract balance: " +
                        contractBalance
                )
            }
        })
    })

    describe("withdraw", function () {
        console.log("withdraw is starting....")

        it("测试收取合约所有余额, tags==01", async function () {
            const beforeContractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const beforeDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionRes = await fundMe.withdraw()
            const transactionReceipt = await transactionRes.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            assert.equal(afterContractBalance, 0)
            assert.equal(
                beforeContractBalance.add(beforeDeployerBalance).toString(),
                aftereDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
