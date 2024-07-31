const { run } = require("hardhat")

async function verify(address, args) {
    console.log("verifying contract...")
    try {
        await run("verify:verify", {
            address: address,
            construtorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verifyed")) {
            console.log("already verifyed")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
