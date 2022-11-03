const { BigNumber } = require("ethers");
const hre = require("hardhat");

async function main() {
  
  const [owner] = await hre.ethers.getSigners();
  console.log("owner.address:",owner.address);
  
  const NodeController = await hre.ethers.getContractFactory("NodeController");
  const Register = await hre.ethers.getContractFactory("Register");
  const Commit = await hre.ethers.getContractFactory("Commit");
  const Resolver = await hre.ethers.getContractFactory("Resolver");


  const nodecontroller = await NodeController.deploy();
  await nodecontroller.deployed();
  console.log("bsc ----- NodeController deployed to:", nodecontroller.address);

  const register = await Register.deploy(nodecontroller.address);  
  await register.deployed();
  console.log("bsc ----- Register and Erc721 deployed to:", register.address);
  
  const resolver = await Resolver.deploy(nodecontroller.address);
  console.log("bsc ----- Resolver deployed to:", resolver.address);
  
  const commit = await Commit.deploy(
    1,                                      // uint256 _minCommitmentAge,
    BigNumber.from("200000"),               // uint256 _maxCommitmentAge,
    BigNumber.from("10000000000000000"),                                      // uint256 baseprice,
    BigNumber.from("317097919"),                                      // uint256 baseprice,              // uint256 premiumprice,
    register.address  // Register _base
  );
  await commit.deployed();
  console.log("bsc ----- Commit deployed to:", commit.address);


  await register.setdefaultResolver(resolver.address);
  const defaultResolver = await register.checkdefaultResolver();
  console.log("DefaultResolver", defaultResolver);

  //添加 commit 到 register 的 信任
  await register.addController(commit.address);


  //帮register注册 eth域名
  const hash_eth = await nodecontroller.checkNode("bn");
  //console.log("hash_eth",hash_eth)
  let zero = await nodecontroller.getNode();
  let eth_node = await nodecontroller.makeNode(zero,hash_eth);
  //console.log("eth_node",eth_node);

  await nodecontroller.set2LDowner(
     zero,          //  bytes32 node, 
     hash_eth,          // bytes32 label, 
     register.address         // address owner
    )
  eth_node_owner = await nodecontroller.ownerOfnode(eth_node);
  console.log(".eth所有者打印", register.address, eth_node_owner);


  const AdminInBsc = await hre.ethers.getContractFactory("AdminInEth");
  const adminInBsc = await AdminInBsc.deploy(
    "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",   // endpoint = ILayerZeroEndpoint(_endpoint);
    register.address                                // base = IRegister(_base);
  );
  await adminInBsc.deployed();

  console.log(
    "bsc testnet ----- Admin in bsc deployed to:",
    adminInBsc.address
  );

  const DepositInBsc = await hre.ethers.getContractFactory("DepositInEth");
  const depositInBsc = await DepositInBsc.deploy(
    register.address                               // base = IRegister(_base);
  );
  await depositInBsc.deployed();
  console.log(
    "bsc testnet ----- Deposit in bsc deployed to:",
    depositInBsc.address
  );
  await depositInBsc.setWhitelist(adminInBsc.address, true)
  
  await register.addController(
    adminInBsc.address    //AdminInBSC.addrss
  );//把AdminInBSC放入白名单中，可以直接注册

  await adminInBsc.setdepositAddress(
    depositInBsc.address
    );//设置deposit地址

  await depositInBsc.setOperator(
    adminInBsc.address//AdminInBSC.addrss
  );//把设置为存储合约的appove 

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
