const express = require('express');
const bodyParser = require('body-parser');
const uuid =require('uuid/v1');
const rp = require('request-promise');

const Blockchain = require('../core/blockchain.js'); 
var {middleware} = require('../middleware/middleware.js');

	
var app = express();
var port= process.env.PORT || 3000;

const nodeAddress = uuid().split('-').join('');
var currentNodeURL;


console.log('node Address : '+nodeAddress);

app.use(bodyParser.json());

var bitcoin= new Blockchain();

app.get('/blockchain',(req,res)=>{ 
//Added to set the currentNodeURL
bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
res.send(bitcoin);

});


app.post('/transaction',(req,res)=>{ 
   
   //Added to set the currentNodeURL
   bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
   
   //const newTransaction = bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.reciepient);
   const blockIndex = bitcoin.pushTransactionTopendingTransaction(req.body.transaction);
   
   res.json({ notes: `Transaction will be added to ${blockIndex} block number`}); 

});

app.post('/transaction/boradcast',(req,res)=>{ 

  var transaction = bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.reciepient);
  const blockIndex = bitcoin.pushTransactionTopendingTransaction(transaction);

  const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		
		
		const requestOptions = 
			{
				uri: networkNodeUrl + '/transaction',
				method: 'POST',
				body: { 
				 transaction:transaction
				},
				json: true
			};
		    regNodesPromises.push(rp(requestOptions));
	});
	
	Promise.all(regNodesPromises)
		  .then(data =>{
			  res.json({ notes: `Transaction added to network nodes [${bitcoin.networkNodes}]`});
		  })
		  .catch(error => {
			  res.json({ notes: `Transaction failed to added in all network nodes  [${error}]`});  
		  } );		

});




app.get('/mine',(req,res)=>{ 
   
   //Added to set the currentNodeURL
   bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
   
   const lastBlock = bitcoin.getLastBlock();
   //console.log("lastBlock = "+JSON.stringify(lastBlock,undefined,2));
   
   const lastBlockHash = lastBlock['hash'];
   const currentBlockData = {
	 transaction :  bitcoin.pendingTransaction,
	 index :  lastBlock['index'] +1
   };
   const nonce =bitcoin.proofOfWork(lastBlockHash,currentBlockData);
   const currentBlockHash = bitcoin.hashBlock(lastBlockHash,currentBlockData,nonce);
   const newBlock =bitcoin.createNewBlock(nonce,lastBlockHash,currentBlockHash);
   
   /***/
   const requestPromises = [];
   bitcoin.networkNodes.forEach(networkNodeUrl => {
	   const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};
		requestPromises.push(rp(requestOptions));
   });
   
   Promise.all(requestPromises)
   .then(data => {
	   //bitcoin.createNewTransaction(12.5,"00",nodeAddress);
	   const requestOptions = {
			uri: bitcoin.currentNodeURL + '/transaction/boradcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	   
   })
   .then(data => {
	   res.json({ 
					notes : `new block added to index # ${newBlock['index']}`,
					node : newBlock
				});
   });
   
   /***/
  
});



// receive new block
app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		  bitcoin.chain.push(newBlock);
		  bitcoin.pendingTransaction = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});
//**********************register-and-broadcast-node**********************
//       URLS : register-and-broadcast-node
//       DESC : Register and broadcast node URL to other node in the network 
//***********************************************************************
app.post('/register-and-broadcast-node', (req, res) => {
    //Added to set the currentNodeURL
    bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
	
	
	
	
	
	var newNodeUrl =req.body.newNodeUrl;
	if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
	{		
	  bitcoin.networkNodes.push(newNodeUrl);
	}//end if
	
	const regNodesPromises = [];
	
	
	const validateNodeOption = 
			{
				uri: newNodeUrl + '/diagnostic/isAlive',
				method: 'GET',
				json: true
			};
			
	rp(validateNodeOption)
	.then ( data => {
		bitcoin.networkNodes.forEach(networkNodeUrl => {
		
				//console.log("inside networkNodeUrl loop");
				const requestOptions = 
				{
					uri: networkNodeUrl + '/register-node',
					method: 'POST',
					body: { newNodeUrl: newNodeUrl },
					json: true
				};
				regNodesPromises.push(rp(requestOptions));
			});
	
	Promise.all(regNodesPromises)
	.then(data =>{
					//console.log("Nodes to be added "+[ ...bitcoin.networkNodes, bitcoin.currentNodeURL ]);
					
					const bulkRegisterOptions = 
					{
						uri: newNodeUrl + '/register-nodes-bulk',
						method: 'POST',
						body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeURL ] },
						json: true
					};
				    return rp(bulkRegisterOptions);
				})
				.then (data => {
					res.json({ note: 'New node registered with network successfully.' });
				})
	.catch(error =>{	
		res.json({ note: 'Error in registering new node.' });
	})	
		
	}// then-data
	)
	.catch( error => {
		bitcoin.networkNodes.splice(bitcoin.networkNodes.indexOf(newNodeUrl),1);
		res.json({ note: `Error in registering nodeURL. ${newNodeUrl}` });
	}// then-error 
	)
	
	
			
});


//**********************/register-node**********************************
//       URLS : /register-node
//       DESC : Add new nodeURL to networkNodes Array
//***********************************************************************
app.post('/register-node', function(req, res) {
	//Added to set the currentNodeURL
    bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
	
	const newNodeUrlVar = req.body.newNodeUrl;
	const notCurrentNode = bitcoin.currentNodeURL !== newNodeUrlVar;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrlVar) == -1;
	
	if (nodeNotAlreadyPresent && notCurrentNode)
	{
		bitcoin.networkNodes.push(newNodeUrlVar);
		res.json({ note: 'New node registered successfully.' });
	}	
	else {
	  res.json({ note: 'Reject current node '+newNodeUrlVar });
	}	

});


//**********************/register-nodes-bulk**********************************
//       URLS : /register-nodes-bulk
//       DESC : networkNodeUrl to networkNodeUrl
//***********************************************************************
app.post('/register-nodes-bulk',function(req, res) {
	//Added to set the currentNodeURL
    bitcoin.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
	const allNetworkNodes = req.body.allNetworkNodes;
	 
	allNetworkNodes.forEach(networkNodeUrl => {
		
		const networkNodeUrlNotNULL = networkNodeUrl !== null ;
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeURL !== networkNodeUrl;
	
		if (networkNodeUrlNotNULL && nodeNotAlreadyPresent && notCurrentNode) 
		{
			bitcoin.networkNodes.push(networkNodeUrl);
		}	
	});

	res.json({ note: 'Bulk registration successful.' });
});


app.get('/diagnostic/isAlive',(req,res) => {
	res.status(200).send();
});



//**********************getNodeURL**********************
//       URLS : diagnostic/getNodeURL
//       DESC : Get Nodes URL back 
//******************************************************
app.get('/diagnostic/getNodeURL', (req,res) => {
	res.send(req.protocol+"://"+req.get('host')+req.originalUrl)
});
 
// Listening method 
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});