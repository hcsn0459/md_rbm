const { BigNumber } = require("ethers");
const hre = require("hardhat");

async function main() {

  const [owner] = await hre.ethers.getSigners();
  console.log("owner.address:",owner.address);
  
  const AdminInMumbai = await hre.ethers.getContractFactory("AdminInEth_Gen");
  const adminInMumbai = await AdminInMumbai.deploy(
    "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" // endpoint = ILayerZeroEndpoint(_endpoint);
  );

  await adminInMumbai.deployed();
  
  console.log(
    "Mumbai ----- AdminInMumbai and Mumbai-erc721 deployed to:",
    adminInMumbai.address
  );

  const DepositInMumbai = await hre.ethers.getContractFactory("DepositInEth");
  const depositInMumbai = await DepositInMumbai.deploy(
    adminInMumbai.address // base = IERC721A(_base);
  );

  await depositInMumbai.deployed();

  console.log(
    "Mumbai ----- DepositInMumbai deployed to:",
    depositInMumbai.address
  );

  await depositInMumbai.setWhitelist(adminInMumbai.address, true) //设置白名单


  await adminInMumbai.setdepositAddress(
    depositInMumbai.address
  );//设置deposit地址

  await depositInMumbai.setOperator(
    adminInMumbai.address                    //AdminInETH.addrss
  );      //把设置为存储合约的appove 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npx hardhat run /Users/hcsn/Desktop/sns_evm-main/scripts/new/asChainInMumbai --network mumbai