import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {getContract} from "hardhat-deploy-ethers/internal/helpers";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.getNamedAccounts();
    const deployer = accounts.admin;

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    const {address: lib} = await hre.deployments.deploy(
        "IterableMapping",
        {from: deployer, log: true,}
    );

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    await hre.run("verify:verify", {
        address: lib,
    });

    const args = [
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // uniswap swap
    ];
    const {address} = await hre.deployments.deploy("PresidentOptimus", {
        from: deployer,
        args: args,
        log: true,
        libraries: {
            IterableMapping: lib,
        }
    });

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    await hre.run("verify:verify", {
        address: address,
        constructorArguments: args,
        libraries: {
            IterableMapping: lib,
        }
    });
};

func.tags = ["PresidentOptimus"];

export default func;
