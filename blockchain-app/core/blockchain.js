var sha256 = require('sha256');
const uuid =require('uuid/v1');

//constructor function
function Blockchain(){
	this.chain= [];
	this.pendingTransaction =[];
	this.currentNodeURL="";
	this.networkNodes = [];
	
	//adding genesis block 
	this.createNewBlock(100,'0','0');
}


/* 
Method Name : createNewBlock
Description : Prototype function to create  a new block 
*/
Blockchain.prototype.createNewBlock = function (nonce,previousBlockHash,hash) { 
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transaction : this.pendingTransaction ,
		nonce:nonce,
		hash:hash,
		previousBlockHash:previousBlockHash
	};
	
	this.pendingTransaction =[];
	
	this.chain.push(newBlock);
	
	
	return newBlock;
}

/* 
Method Name : getLastBlock
Description : Prototype function to return the last block 
*/
Blockchain.prototype.getLastBlock = function () { 
 return this.chain[this.chain.length -1];
}

/* 
Method Name : createNewTransaction
Description : Add a new Transaction 
*/
Blockchain.prototype.createNewTransaction = function (amount,sender,reciepient){
	const newTransaction = {
		amount, /**using ES6 feature**/
		sender,
		reciepient,
		transactionID :uuid().split('-').join('')
	};
	
	return newTransaction;
	
	

	// This portion of the code moved to a new method 
	//this.pendingTransaction.push(newTransaction);
	//return (this.getLastBlock()['index']) +1; /**Return index of the block to which this transaction should be added to**/
}

/* 
Method Name : pushTransactionTopendingTransaction
Description : push Transaction to Pending Transaction
*/
Blockchain.prototype.pushTransactionTopendingTransaction = function (transaction){
	
	this.pendingTransaction.push(transaction);
	return (this.getLastBlock()['index']) +1;
}//

/* 
Method Name : hashBlock
Description : Hash a given block 
*/
Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockData,nonce)
{
  	var dataString = previousBlockHash+nonce.toString()+JSON.stringify(currentBlockData);
	//console.log("dataString :	"+dataString)
	return sha256(dataString);
}


/*
Method Name : proofOfWork	
Description : get proof of work by accuring a nonce value which return hash value of previousBlockHash & currentBlockDatastarting with 0000 
*/
Blockchain.prototype.proofOfWork = function(previousBlockHash,currentBlockData) {
	let nonce=0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);	

	while (hash.substring(0,4) !== '0000')
    {
	  nonce++;	
      hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);	
	}//end of while 
	
	return nonce;
}


Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;
	
	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transaction: currentBlock['transaction'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	
	
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transaction'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
}//chainIsValid



Blockchain.prototype.setcurrentNodeURL = function(currentNodeURL) {
	
	if(this.currentNodeURL.length === 0)
	{	
		this.currentNodeURL=currentNodeURL;
	}	
}


//Export function 
module.exports = Blockchain;