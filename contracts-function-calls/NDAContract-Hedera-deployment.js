const {
  Client,
  PrivateKey,
  ContractCreateTransaction,
  ContractFunctionParameters,
  AccountId,
  Hbar,
  FileAppendTransaction,
  FileCreateTransaction,
} = require("@hashgraph/sdk");
const fs = require("fs");
require("dotenv").config({});
const { getAddressFromAccount } = require('@hashgraph/hethers').utils;

// Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {
  // Import the compiled contract bytecode
  const bytecode = fs.readFileSync("NDAContract_sol_NDAContract.bin");

  // Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction().setKeys([myPrivateKey]);
  const fileCreateSubmit = await fileCreateTx.execute(client);
  const fileCreateReceipt = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateReceipt.fileId;
  console.log(`- The smart contract bytecode file ID is: ${bytecodeFileId} \n`);

  // Append contents to the file
  const fileAppendTx = new FileAppendTransaction()
    .setFileId(bytecodeFileId)
    .setContents(bytecode)
    .setMaxChunks(10)
    .setMaxTransactionFee(new Hbar(2));
  const fileAppendSubmit = await fileAppendTx.execute(client);
  const fileAppendReceipt = await fileAppendSubmit.getReceipt(client);
  console.log(`- Content added: ${fileAppendReceipt.status} \n`);
  console.log(`- The Bytecode file ID is: ${fileAppendReceipt.fileId} \n`);

  const startupContractAddress = "0.0.13721867";
  const ethAddress = getAddressFromAccount(startupContractAddress);

  // Create the smart contract
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(3000000)
    .setConstructorParameters(new ContractFunctionParameters()
      .addAddress(ethAddress)
    );
  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateReceipt = await contractInstantiateSubmit.getReceipt(client);
  const contractId = contractInstantiateReceipt.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
