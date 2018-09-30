var sha256 = require('sha256');
const uuid =require('uuid/v1');

//constructor function
function Blockchain(){
	this.chain= [];
	this.pendingTransaction =[];
	this.currentNodeURL="";
	this.networkNodes = [];
	
	//adding genesis block 
	this.createNewBlock(0,'0','0');
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


Blockchain.prototype.setcurrentNodeURL = function(currentNodeURL) {
	
	if(this.currentNodeURL.length === 0)
	{	
		this.currentNodeURL=currentNodeURL;
	}	
}


//Export function 
module.exports = Blockchain;