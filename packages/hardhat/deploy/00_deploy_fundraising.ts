// 02_deploy_fundraising.ts
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // Deploy StableCoin if not deployed yet
  // Specify the full path or use the fully qualified name
  const stableCoin = await deploy("StableCoin", {
    from: deployer,
    args: [],
    log: true,
  });

  // Deploy Fundraising contract
  await deploy("Fundraising", {
    from: deployer,
    args: [stableCoin.address],
    log: true,
  });
};

deployFunction.tags = ["Fundraising"];
export default deployFunction;
