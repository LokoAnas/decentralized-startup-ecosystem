const {
	Client,
	PrivateKey,
	FileCreateTransaction,
	FileAppendTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	AccountId,
	TopicCreateTransaction,
	Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");
require("dotenv").config({});

// Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {
	// Import the compiled contract bytecode
	const bytecode = fs.readFileSync("StartupContract_sol_StartupContract.bin");

	// Create a file on Hedera and store the hex-encoded bytecode
	const fileCreateTx = new FileCreateTransaction().setKeys([myPrivateKey]);
	const fileSubmit = await fileCreateTx.execute(client);
	const fileCreateRx = await fileSubmit.getReceipt(client);
	const bytecodeFileId = fileCreateRx.fileId;
	console.log(`- The smart contract bytecode file ID is: ${bytecodeFileId}\n`);

	// Append contents to the file
	const fileAppendTx = new FileAppendTransaction()
		.setFileId(bytecodeFileId)
		.setContents(bytecode)
		.setMaxChunks(10)
		.setMaxTransactionFee(new Hbar(2));
	const fileAppendSubmit = await fileAppendTx.execute(client);
	const fileAppendRx = await fileAppendSubmit.getReceipt(client);
	console.log(`- Content added: ${fileAppendRx.status}\n`);
	console.log(`- The Bytecode file ID is: ${fileAppendRx.status}\n`);

	// Create the smart contract
	const contractInstantiateTx = new ContractCreateTransaction()
		.setBytecodeFileId(bytecodeFileId)
		.setGas(3000000)
		.setConstructorParameters(new ContractFunctionParameters());
	const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	const contractId = contractInstantiateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${contractId}`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress}\n`);

	// Create the transaction to get the topic ID
	const topicTransaction = new TopicCreateTransaction();

	// Sign with the client operator private key and submit the transaction to a Hedera network
	const topicTxResponse = await topicTransaction.execute(client);

	// Request the receipt of the transaction
	const topicReceipt = await topicTxResponse.getReceipt(client);

	// Get the topic ID
	const topicId = topicReceipt.topicId;

	console.log("The new topic ID is " + topicId);

	// Query the contract to check changes in state variable

	// Call contract function to update the state variable

	// Query the contract to check changes in state variable
}

main();
