const { Client, ContractFunctionParameters, ContractId, ContractExecuteTransaction, AccountId, PrivateKey, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();

async function payInvestment() {
  const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  const contractId = ContractId.fromString("0.0.14520798");

  const startupId = 1;
  const functionParams = new ContractFunctionParameters().addUint256(startupId);

  const executeTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction("getFundSeekerAddress", functionParams)
    .setTransactionMemo("Hell yeah!");

  const transactionResponse = await executeTx.execute(client);
  const transactionReceipt = await transactionResponse.getReceipt(client);

  if (transactionReceipt.status.toString() === "SUCCESS") {
    console.log("Payment successful!");
    console.log(transactionResponse.transactionId.toString());

    const fundSeekerAddress = transactionReceipt.getContractFunctionResult().toAddress();
    console.log("Fund Seeker Address:", fundSeekerAddress.toString());
  } else {
    console.error(
      "Payment failed with trans:",
      transactionReceipt.status.toString()
    );
  }
}

payInvestment();
