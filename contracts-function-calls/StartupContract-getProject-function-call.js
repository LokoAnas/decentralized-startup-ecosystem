const { Client, AccountId, PrivateKey, ContractCallQuery, ContractFunctionParameters, Hbar } = require("@hashgraph/sdk");
const { getAddressFromAccount } = require('@hashgraph/hethers').utils;
require("dotenv").config();

async function getProject(fundSeekerHederaAddress) {
  const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

  const contractId = "0.0.13721867"; // Replace with the actual contract ID
  const ethAddress = getAddressFromAccount(fundSeekerHederaAddress);
  const functionParams = new ContractFunctionParameters().addAddress(ethAddress);
  const callQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(1000000) // Set the desired gas limit
    .setFunction("getProject", functionParams);

  try {
    // Increase the maximum query payment to accommodate the cost
    client.setMaxQueryPayment(new Hbar(2)); // Set the desired maximum query payment in ℏ (HBAR)
    const contractFunctionResult = await callQuery.execute(client);
    const goal = contractFunctionResult.getUint256(0);
    console.log("Fund Seeker's goal:", goal);
  } catch (error) {
    console.error("An error occurred during contract execution:", error);
  }
}

// Replace fundSeekerHederaAddress with the desired fund seeker's Hedera address
const fundSeekerHederaAddress = "0.0.3880533";
getProject(fundSeekerHederaAddress);
