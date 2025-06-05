const {
  Client,
  ContractFunctionParameters,
  ContractId,
  ContractCallQuery,
  AccountId,
  PrivateKey,
  TransferTransaction,
} = require("@hashgraph/sdk");
const { getAddressFromAccount } = require('@hashgraph/hethers').utils;
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config({});

// Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {
  const contractId = ContractId.fromString("0.0.13740335");
  const investorAddress = myAccountId;
  const ethInvestorAddress = getAddressFromAccount(investorAddress);
  // Create a ContractCallQuery to call the getNDAStatus function
  const functionParams = new ContractFunctionParameters().addAddress(ethInvestorAddress);

  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(300000)
    .setFunction("getNDAStatus", functionParams);

  // Execute the query and retrieve the result
  const queryResponse = await contractCallQuery.execute(client);
  // console.log("Query Response:", queryResponse);

  const ndaBytes = queryResponse.bytes; //.getBytes32(0);
  // console.log("NDA Bytes:", ndaBytes);

  if (ndaBytes !== null) {
    const abi = JSON.parse(fs.readFileSync("NDAContract_sol_NDAContract.abi"));
    const iface = new ethers.Interface(abi);
    const decodedNdas = iface.decodeFunctionResult("getNDAStatus", ndaBytes);
    // console.log("Decoded NDAs:", decodedNdas);

    const ndas = decodedNdas[0];
    console.log("NDA Status:");
    for (const nda of ndas) {
      console.log("Investor:", nda.investor);
      console.log("Fundraiser:", nda.fundraiser);
      console.log("Signed:", nda.signed);
      console.log("Timestamp:", nda.timestamp);
      console.log("--------------------");
    }
  } else {
    console.log("No NDA data found.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
