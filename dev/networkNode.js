const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const app = express();
// The process.argv if an array of the commands in the package.json file to start runing the app
const port = process.env.PORT ||  process.argv[2];

const nodeAddress = uuid().split('-').join('');

// Our greencoin Blockchain
const greencoin = new Blockchain.Blockchain();

// This will house the network node that mined the blockhash
const currentNodeUrl = process.env.NODE_ENV || process.argv[3];
let networkNodeUrls = [];






// This timestamp will mark when the chain was created and be used to determine when the next mining will be
const blockTimestamp = Date.now();
// Blockchain.isBlockMined = false when you want to start mining
var myVar = setInterval(myTimer, 120000);

function myTimer() {
    if(currentNodeUrl === "http://localhost:3001"){
        rp("http://localhost:3001/mine")
        .then(data => {
            // console.log("Block mined");
        });
    }
}





// Including the body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// This is the end point to get the entire blockchain
app.get('/blockchain', (req, res) => {
    res.send(greencoin);
});

// This is the end point will push the transaction to the blockchain
app.post('/transaction', (req, res) => {
    const newTransation = req.body;
    const blockIndex = greencoin.addTransactionToPendingTransactions(newTransation);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// This is the end point will push the vote to the blockchain
app.post('/vote', (req, res) => {
    const newVote = req.body;
    const blockIndex = greencoin.addVoteToPendingVotes(newVote);
    res.json({ note: `Vote will be added in block ${blockIndex}.` });
});

// This is the end point will push the candidate to the blockchain
app.post('/candidate', (req, res) => {
    const newCandidate = req.body;
    const blockIndex = greencoin.addCandidateToPendingCandidates(newCandidate);
    res.json({ note: `Candidate will be added in block ${blockIndex}.` });
});

// This is the end point will push the voterId to the blockchain
app.post('/voterId', (req, res) => {
    const newVoterId = req.body;
    const blockIndex = greencoin.addVoterIdToPendingVoterIds(newVoterId);
    res.json({ note: `VoterId will be added in block ${blockIndex}.` });
});

// This is the end point will push the voter to the blockchain
app.post('/voter', (req, res) => {
    const newVoter = req.body;
    const blockIndex = greencoin.addVoterToPendingVoters(newVoter);
    res.json({ note: `Voter will be added in block ${blockIndex}.` });
});

// This is the end point will push the admin to the blockchain
app.post('/admin', (req, res) => {
    const newAdmin = req.body;
    const blockIndex = greencoin.addVoterToPendingVoters(newAdmin);
    res.json({ note: `Admin will be added in block ${blockIndex}.` });
});

// This is the end point will push the election to the blockchain
app.post('/election', (req, res) => {
    const newElection = req.body;
    const blockIndex = greencoin.addElectionToPendingElections(newElection);
    res.json({ note: `Election will be added in block ${blockIndex}.` });
});

// This end point would create the transaction and then broadcast it to other nodes in the network
app.post('/transaction/broadcast', (req, res) => {
    const newTransation = greencoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    greencoin.addTransactionToPendingTransactions(newTransation);

    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransation,
            json: true
        };

        requestPromises.push( );
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcasted successfully.' });
    });
});

// This end point would create the vote and then broadcast it to other nodes in the network
app.post('/vote/broadcast', (req, res) => {
    const newVote = greencoin.createNewVote(req.body.voterId, req.body.candidateId, req.body.electionId);

    if(newVote !== null){
        greencoin.addVoteToPendingVotes(newVote);

        const requestPromises = [];
        greencoin.networkNodes.forEach( networkNodeUrl => {
            const requestOptions = {
                uri: networkNodeUrl + '/vote',
                method: 'POST',
                body: newVote,
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises)
        .then(data => {
            res.json({ success: true });
        });
    }else{
        res.json({ success: false });
    }
});

// This end point would create the candidate and then broadcast it to other nodes in the network
app.post('/candidate/broadcast', (req, res) => {
    const newCandidate = greencoin.createNewCandidate(req.body.candidateName, req.body.candidateParty,
        req.body.electionId, req.body.candidateImage);
    greencoin.addCandidateToPendingCandidates(newCandidate);

    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/candidate',
            method: 'POST',
            body: newCandidate,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Candidate created and broadcasted successfully.' });
    });
});

// This end point would create the election and then broadcast it to other nodes in the network
app.post('/election/broadcast', (req, res) => {
    const newElection = greencoin.createNewElection(req.body.electionName);
    greencoin.addElectionToPendingElections(newElection);

    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/election',
            method: 'POST',
            body: newElection,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Election created and broadcasted successfully.' });
    });
});

// This end point would create the voterId and then broadcast it to other nodes in the network
app.get('/voterId/broadcast', (req, res) => {
    const newVoterId = greencoin.createNewVoterId();
    greencoin.addVoterIdToPendingVoterIds(newVoterId);

    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/voterId',
            method: 'POST',
            body: newVoterId,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({
            note: "VoterId created and broadcasted successfully.",
            voterId: newVoterId
        });
    });
});

// This end point would create the voter and then broadcast it to other nodes in the network
app.post('/voter/broadcast', (req, res) => {
    const newVoter = greencoin.createNewVoter(req.body.voterPassword, req.body.voterId);
    if(newVoter !== null){
        greencoin.addVoterToPendingVoters(newVoter);

        const requestPromises = [];
        greencoin.networkNodes.forEach( networkNodeUrl => {
            const requestOptions = {
                uri: networkNodeUrl + '/voter',
                method: 'POST',
                body: newVoter,
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: "Voter created and broadcasted successfully.",
                voter: newVoter
            });
        });
    }else {
        res.json({
            note: "Invalid voter Id",
            voter: newVoter
        });
    }
});

// This end point would create the admin and then broadcast it to other nodes in the network
app.post('/admin/broadcast', (req, res) => {
    const newAdmin = greencoin.createNewAdmin(req.body.adminId);
    greencoin.addAdminToPendingAdmins(newAdmin);

    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/admin',
            method: 'POST',
            body: newAdmin,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({
            note: "Admin created and broadcasted successfully.",
            admin: newAdmin
        });
    });
});

// This is the end point to mine a new block and add it to the Blockchain
app.get('/mine', (req, res) => {

    const lastBlock = greencoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: greencoin.pendingTransactions,
        votes: greencoin.pendingVotes,
        candidates: greencoin.pendingCandidates,
        index: lastBlock['index'] +1
    };
    const nonce = greencoin.proofOfWork(previousBlockHash, currentBlockData);
    const hash = greencoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = greencoin.createNewBlock(nonce, previousBlockHash, hash /*, currentNodeUrl*/);

    // Now we broadcast the new block to all the other nodes in the network
    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNode => {
        const requestOptions = {
            uri: networkNode + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        // Now rewarding the node that mined the new block.
        // Since the cryptocurrency world lies on a decentralized network, then there would quite a number of nodes/servers running the bitcoin mining,
        // But for now we only have one yet
        const requestOptions = {
            uri: greencoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 10,
                sender: '00',
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    })
    // .then(data => {
    //     // I am adding the consensus here so that after a block is mined, the network maintaince the block with the max length
    //     const requestOptions = {
    //         uri: greencoin.currentNodeUrl + '/consensus',
    //         method: 'GET',
    //         json: true
    //     };
    //     return rp(requestOptions);
    // })
    .then(data => {
        res.json({
            note: "New block mined and broadcasted successfully",
            block: newBlock
        });
    });

    // After the proof of work is complete, post is sent to other servers that the block has been mined correctly
    // So we are to inform other nodes that the block has been mined
    // const requestPromises = [];
    // greencoin.networkNodes.forEach( networkNode => {
    //     const requestOptions = {
    //         uri: networkNode + '/blockMined',
    //         method: 'POST',
    //         body: { networkNodeUrl: currentNodeUrl },
    //         json: true
    //     };
    //     requestPromises.push(rp(requestOptions));
    // });
    //
    // Promise.all(requestPromises)
    // .then(data => {
    //
    //     const requestPromises1 = [];
    //     greencoin.networkNodes.forEach( networkNode => {
    //         const requestOptions = {
    //             uri: networkNode + '/getStackedNode',
    //             method: 'GET',
    //             json: true
    //         };
    //         requestPromises1.push(rp(requestOptions));
    //     });
    //
    //     var counts = {};
    //     Promise.all(requestPromises1)
    //     .then(data => {
    //         data.forEach( nodeStack => {
    //             stack = nodeStack.nodeStack;
    //
    //         });
    //     });



        // const requestOptions = {
        //     uri: greencoin.currentNodeUrl + '/transaction/broadcast',
        //     method: 'GET',
        //     body: {
        //         amount: 10,
        //         sender: '00',
        //         recipient: nodeAddress
        //     },
        //     json: true
        // };
        // return rp(requestOptions);
        //
        // // Now rewarding the node that mined the new block.
        // // Since the cryptocurrency world lies on a decentralized network, then there would quite a number of nodes/servers running the bitcoin mining,
        // // But for now we only have one yet
        // const requestOptions = {
        //     uri: greencoin.currentNodeUrl + '/transaction/broadcast',
        //     method: 'POST',
        //     body: {
        //         amount: 10,
        //         sender: '00',
        //         recipient: nodeAddress
        //     },
        //     json: true
        // };
        // return rp(requestOptions);
    // })
    // .then(data => {
    //     res.json({
    //         note: "New block mined and broadcasted successfully"
    //     });
    // });

    // .then(data => {
    //     // I am adding the consensus here so that after a block is mined, the network maintaince the block with the max length
    //     const requestOptions = {
    //         uri: greencoin.currentNodeUrl + '/consensus',
    //         method: 'GET',
    //         json: true
    //     };
    //     return rp(requestOptions);
    // })
    // .then(data => {
    //     res.json({
    //         note: "New block mined and broadcasted successfully",
    //         block: newBlock
    //     });
    // });

});




app.post('/blockMined', (req, res) => {
    const nodeUrl = req.body.networkNodeUrl;
    Blockchain.isBlockMined = true;

    let duplicate = false;

    if(networkNodeUrls.length){
        networkNodeUrls.forEach( networkNode => {
            if(networkNode === nodeUrl){
                duplicate = true;
            }
        });
    }

    if(currentNodeUrl !== nodeUrl && !duplicate){
        networkNodeUrls.push(nodeUrl);
    }

    res.json({
        note: "Done."
    });
});

app.get('/getStackedNode', (req, res) => {
    res.json({
        nodeStack: networkNodeUrls
    });
});




// This end point would receive newblock and save it in the blockchain of the node
app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = greencoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index']+1 === newBlock['index'];
     if(correctHash && correctIndex){
        greencoin.chain.push(newBlock);
        greencoin.pendingTransactions = [];
        greencoin.pendingVotes = [];
        greencoin.pendingCandidates = [];
        res.json({
            note: "New block received and accepted.",
            newBlock: newBlock
        });
    }else{
        res.json({
            note: "New block rejected.",
            newBlock: newBlock
        });
    }
});

// Now to make the network truely decentralized, there should be ways in which the different are registered to the network and are
// capable of talking to each other
// Below are endpoints that allow for this
//-------------------------------------------------------------------------------------------------------
// This will register a new node on it own server and then broadcast it to other nodes in the network
app.post('/register-and-broadcast-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    // 1st we confirm that the newNode is not part of the existing nodes in the network and then we register the node on our own end of the network
    // by adding it to the list of networkNode url in our networkNodes array
    if((greencoin.networkNodes.indexOf(newNodeUrl) == -1) && (greencoin.currentNodeUrl !== newNodeUrl))
        greencoin.networkNodes.push(newNodeUrl);

    // Then we send request to all other network nodes in the network to register the node in the own end and not to broadcast again with the
    // '/register-node' endpoint and then we get responses from them to confirm that they have done so
    const registerNodesPromises = [];
    greencoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
                uri: networkNodeUrl + '/register-node',
                method: 'POST',
                body: { newNodeUrl: newNodeUrl },
                json: true
        };
        registerNodesPromises.push(rp(requestOptions));
    });

    // And then, since this all happens assynchronosely, we will have to create wait for them all to register the node and when they are all
    // done, we now send a req to the newNode to register all the network nodes on his own end, passing newtworkNodes array, and our own node url
    // since it would not be in the array.
    Promise.all(registerNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [ ...greencoin.networkNodes, greencoin.currentNodeUrl ] },
            json: true
        };
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({ note: 'New node regitered with network successfully.' });
    });
});

// Now the other nodes will just register it with no need of broadcasting since it has already been broadcasted
app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    // So we confirm that the newNode is not part of the existing nodes in the network and then we register the node on our own end of the network
    // by adding it to the list of networkNode url in our networkNodes array
    const nodeNotAlreadyPresent = greencoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = greencoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode)
        greencoin.networkNodes.push(newNodeUrl);

    res.json({ note: 'New node registered successfully.' });
});

// This end point will now register all the other nodes with the new node inclusive hence allowing the new node to get the urls of all the other
// nodes in the network
app.post('/register-nodes-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach( networkNode => {
        const nodeNotAlreadyPresent = greencoin.networkNodes.indexOf(networkNode) == -1;
        const notCurrentNode = greencoin.currentNodeUrl !== networkNode;
        if(nodeNotAlreadyPresent && notCurrentNode)
            greencoin.networkNodes.push(networkNode);
    });

    res.json({ note: 'Bulk registration successful.' });
});






//Todo Modify block to broadcast the longest block in the network







// This is the get consensus endpoint that compare the blockchains in the network and get the longest and then checks if it is Valid
// It implements the longest chain rule thet shows that the longest chain in the network is the most accurate
app.get('/consensus', (req, res) => {
    const requestPromises = [];
    greencoin.networkNodes.forEach( networkNodeUri => {
        const requestOptions = {
            uri: networkNodeUri + '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = greencoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        let newPendingVotes = null;
        let newPendingCandidates = null;

        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
                newPendingVotes = blockchain.pendingVotes;
                newPendingCandidates = blockchain.pendingCandidates;
            };
        });

        if (!newLongestChain || (newLongestChain && !greencoin.chainIsValid(newLongestChain))){
            res.json({
                note: "Current chain has not been replaced.",
                chain: greencoin.chain
            });
        }else if (newLongestChain && greencoin.chainIsValid(newLongestChain)){
            greencoin.chain = newLongestChain;
            greencoin.pendingTransactions = newPendingTransactions;
            greencoin.pendingVotes = newPendingVotes;
            greencoin.pendingCandidates = newPendingCandidates;

            res.json({
                note: "Current chain has been replaced.",
                chain: greencoin.chain
            });
        }
    })
});

// The endpoint to get a block with the hash of the block provided
app.get('/block/:blockHash', (req, res) => {
    const blockHash = req.params.blockHash;
    const correctBlock = greencoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

// This endpoint get the transaction in our blockchain from the transactionId passed in
app.get('/transaction/:transactionId', (req, res) => {
    const transactionId = req.params.transactionId;
    const transationData = greencoin.getTransaction(transactionId);
    res.json({
        transationData
    });
});

// This endpoint get the vote in our blockchain from the voteId passed in
app.get('/vote/:voteId', (req, res) => {
    const voteId = req.params.voteId;
    const voteData = greencoin.getVote(voteId);
    res.json({
        voteData
    });
});

// This endpoint get the candidate in our blockchain from the candidateId passed in
app.get('/candidate/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;
    const candidateData = greencoin.getCandiate(candidateId);
    res.json({
        candidateData
    });
});

// This endpoint get the admin in our blockchain from the adminId passed in
app.get('/admin/:adminId', (req, res) => {
    const adminId = req.params.adminId;
    const adminData = greencoin.getAdmin(adminId);
    res.json({
        adminData
    });
});

// This endpoint get the voter in our blockchain from the voterId passed in
app.get('/voter/:voterId', (req, res) => {
    const voterId = req.params.voterId;
    const voterData = greencoin.getVoter(voterId);
    res.json({
        voterData
    });
});

// This endpoint get the election in our blockchain from the electionId passed in
app.get('/election/:electionId', (req, res) => {
    const electionId = req.params.electionId;
    const electionData = greencoin.getElection(electionId);
    res.json({
        electionData
    });
});

// This endpoint get all elections in our blockchain
app.get('/elections', (req, res) => {
    const elections = greencoin.getAllElections();
    res.json({
        elections
    });
});

// This endpoint get all voterIds in our blockchain
app.get('/voterIds', (req, res) => {
    const voterIds = greencoin.getAllVoterIds();
    res.json({
        voterIds
    });
});

// This endpoint get all elections in our blockchain
app.get('/electioncandidates/:electionId', (req, res) => {
    const electionId = req.params.electionId;
    const candidates = greencoin.getElectionCandidates(electionId);
    res.json({
        candidates
    });
});

// This endpoint will get the address transactions and the balance of the address
app.get('/address/:address', (req, res) => {
    const address = req.params.address;
    const addressData = greencoin.getAddressData(address);
    res.json({
        addressData
    });
});

// This endpoint will get the votes of a specific electionId
app.get('/electionvotes/:electionId', (req, res) => {
    const electionId = req.params.electionId;
    const electionVotes = greencoin.getElectionVotes(electionId);
    res.json({
        electionVotes
    });
});

// This is an endpoint for the frontend of the explorer that would send the explorerer to us
app.get('/block-explorer', (req, res) => {
    res.sendFile('./block-explore/index.html', { root: __dirname });
});

// Making the network decentralized would be have different nodes, such that when we run the networkNode again, it should be on a diffrent port.
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});



// TODOS: HANDLE CASE WHEN A NETWORK NODE IS OFFLINE, SUCH THAT IT DOES NOT CAUSE ERRORS IN THE NETWORK. BASICALLY HANDLE ALL EXCEPTIONS THAT COULD CAUSE
// ERROR IN THE NETWORK
