const { Client, ContractExecuteTransaction, ContractFunctionParameters, AccountId, PrivateKey, Status } = require("@hashgraph/sdk");
const { ethers } = require("ethers");
require("dotenv").config({});
const fs = require("fs");

async function registerStartup(name, description, goal) {
  const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);
  const newContractId = "0.0.14520798";

  const contractExecTx = await new ContractExecuteTransaction()
    .setContractId(newContractId)
    .setGas(10000000)
    .setFunction("registerStartup", new ContractFunctionParameters()
      .addString(name)
      .addString(description)
      .addUint256(goal)
    );

  const submitExecTx = await contractExecTx.execute(client);
  const record = await submitExecTx.getRecord(client);
  const receipt = await submitExecTx.getReceipt(client);
  const transactionId = submitExecTx.transactionId;

  if (receipt.status !== Status.Success) {
    console.log("- The transaction failed with status: " + receipt.status.toString());
    return;
  }

  console.log("- The transaction status is: " + receipt.status.toString());
  console.log("- Transaction ID: " + transactionId.toString());
  // console.log("- The transaction record is: ");
  // console.log(record);

  // Retrieve the startupId from the logs in the transaction record
  // const startupId = ethers.hexlify(record.contractFunctionResult.getBytes32(0));
  const startupId = record.contractFunctionResult.getUint256(0);
  // const startupIdd = receipt.toBytes; //toBytes;

  // const decodedStartupId = removeTrailingZeros(startupId);
  console.log("- The startupId is: " + startupId);


registerStartup(
  "Anas Samirrrrr",
  "A brief description of my startup Mamdouh LOL LOLLOLLOL",
  1558
);
