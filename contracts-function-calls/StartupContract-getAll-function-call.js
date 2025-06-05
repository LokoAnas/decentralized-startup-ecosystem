
const {
  Client,
  ContractId,
  ContractCallQuery,
  AccountId,
  PrivateKey,
} = require("@hashgraph/sdk");
const { getAddressFromAccount } = require('@hashgraph/hethers').utils;
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config({});

const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {
  const contractId = ContractId.fromString("0.0.14520798");
  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(300000)
    .setFunction("getAllStartupIds");

  const queryResponse = await contractCallQuery.execute(client);
  const startups = queryResponse.bytes; 
  if (startups !== null) {
    const abi = JSON.parse(fs.readFileSync("StartupContract_sol_StartupContract.abi"));
    const iface = new ethers.Interface(abi);
    const decodedStartups = iface.decodeFunctionResult("getAllStartupIds", startups);

    const SU = decodedStartups[0];
    console.log("Startups:");
    for (const su of SU) {
      console.log("startup ID:", su);
      console.log("-----------------");
    }
  } else {
    console.log("No Startup data found.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
