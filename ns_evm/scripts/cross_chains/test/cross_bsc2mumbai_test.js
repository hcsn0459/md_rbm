// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber,ethers} = require("ethers");
const hre = require("hardhat");
//const commit_abi = require('../../abi/Commit.json')
async function main() {

  
    const [owner] = await hre.ethers.getSigners();

    const Register = await hre.ethers.getContractFactory("Register"); //get abi
    const Commit = await hre.ethers.getContractFactory("Commit");

    const commit = await Commit.attach("0x440c76957c3cb99Caa4e7D86804Ed887B778ba52") //get contract
    //let commit = new ethers.Contract("0xfEf0736c5E1fEA613e94aEe70e70ca922785bA35" ,commit_abi , "https://bsctestapi.terminet.io/rpc")
    
    // const commitment = await commit.makeCommitment(
    //     "sec",
    //     owner.address,
    //     10000,
    //     1
    // )
    // await commit.commit(commitment)

    // await commit.register(
    //     "sec",
    //     owner.address,
    //     10000,
    //     1,
    //     { value: ethers.utils.parseEther("0.1") }
    // )

    const label = await commit.check_lable("sec")
    console.log("sec label", label);

    const register = Register.attach("0x0Ba1644f1543e969c4D45FB8296A9E9Ed0D6eF9C");
    const label_owner = await register.ownerOf(label)
    console.log("owner", label_owner);

    // const AdminInBsc = await hre.ethers.getContractFactory("AdminInEth");
    // const adminInBsc = await AdminInBsc.attach("0xB4c9fFA8B0dC850a80F013AD1fba57187456c6d9");

    //  await register.approve(adminInBSC.address, label);
    // await adminInBSC.crossChain(
    //     10006,
    //     "0xb498e11D8C02369d93AE5080a4BF27B05f56726B",
    //     label,
    //     { value: ethers.utils.parseEther("1") },
    //     )

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
