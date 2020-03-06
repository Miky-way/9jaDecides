const sha256 = require('sha256');
const uuid = require('uuid/v1');
// const currentNodeUrl = process.argv[3];
const currentNodeUrl = "https://naija-decides.herokuapp.com";

// This variable will be used to check if another node has mined the blockhash
let isBlockMined = false;

// The blockchain object that contains arrays of the chains and that of newTransactions to be added to new block
function Blockchain(){
    this.chain = [];
    this.pendingVotes = [];
    this.pendingTransactions = [];
    this.pendingCandidates = [];
    this.pendingElections = [];
    this.pendingVoters = [];
    this.pendingAdmins = [];
    this.pendingVoterIds = [];
    this.difficulty = 4;
    // Setting the currentNodeUrl
    this.currentNodeUrl = currentNodeUrl;
    // An array of all the other nodes in the network
    this.networkNodes = [];
    // Now we will try to generate the genesis block inside the blockchain, which is the first block of the blockchain with no data in it
    this.createNewBlock(0, '0', '0'  /*, currentNodeUrl*/);
}

// This is function prototype that has a function that is the same for all the blockchain objects. It simply creates new block
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash  /*, nodeUrl*/) {
    // In here is the block function with all the information of the block
    // index : contains the position of the block in the chain
    // timestamp : a timestamp of when the block was created
    // transactions : we want to add all the pending transactions to the new block's transactions
    // nonce : the nonce is simply a number that proves that the block was created in a legitimate way using the proof of work
    // hash : this is like a fingerprint for all the new transactions it would also include the hash of the previous blockchain
    // previousBlockHash : the hash of the data of our previous block
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        // nodeUrl: nodeUrl,
        votes: this.pendingVotes,
        candidates: this.pendingCandidates,
        transactions: this.pendingTransactions,
        elections: this.pendingElections,
        voters: this.pendingVoters,
        admins: this.pendingAdmins,
        voterIds: this.pendingVoterIds,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingVotes = [];
    this.pendingCandidates = [];
    this.pendingTransactions = [];
    this.pendingVoters = [];
    this.pendingElections = [];
    this.pendingAdmins = [];
    this.pendingVoterIds = [];
    this.chain.push(newBlock);

    return newBlock;
}

// Checks if the chain is valid
Blockchain.prototype.chainIsValid = function (blockchain) {
    let chainValid = true;

    for (let i=1; i<blockchain.length; i++){
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i-1];
        const blockHash = this.hashBlock(previousBlock['hash'], {
            votes: currentBlock['votes'],
            index: currentBlock['index']
        }, currentBlock['nonce']);

        if((blockHash.substring(0, 4) !== "0000") || (currentBlock['previousBlockHash'] !== previousBlock['hash'])){
            chainValid = false; // Chain is not valid
            break;
        }
    }
    // Checking the legitimacy of the genesis block
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 0;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctVotes = genesisBlock['votes'].length = 0;
    const correctCandidates = genesisBlock['candidates'].length = 0;
    const correctTransactions = genesisBlock['transations'].length = 0;
    const correctElections = genesisBlock['elections'].length = 0;
    const correctVoters = genesisBlock['voters'].length = 0;
    const correctAdmins = genesisBlock['admins'].length = 0;
    const correctVoterIds = genesisBlock['voterIds'].length = 0;

    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctVotes || !correctTransactions || !correctCandidates
        || !correctElections || !correctVoters || !correctAdmins || !correctVoterIds)
        chainIsValid = false;

    return chainValid;
}


// This function would return the last block in our Blockchain
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

// This function would be called to check if a voter has voted before before a newVote is created
Blockchain.prototype.checkVoterRecord = function (voterId, electionId){
    const electionVotes = [];
    let voted = false;

    this.chain.forEach(block => {
        block.votes.forEach(vote => {
            if(vote.voterId === voterId){
                if(vote.electionId === electionId){
                    voted = true;
                }
            }
        });
    });

    this.pendingVotes.forEach(pendingVote => {
        if(pendingVote.voterId === voterId){
            if(pendingVote.electionId === electionId){
                voted = true;
            }
        }
    });

    return voted;
}

// This function would create new Votes
Blockchain.prototype.createNewVote = function (voterId, candidateId, electionId) {

    // Before creating new vote, make sure that the voter has not voted on the election before
    let voted = this.checkVoterRecord(voterId, electionId);

    if(!voted){
        const newVote = {
            voterId: voterId,
            candidateId: candidateId,
            electionId: electionId,
            voteId: uuid().split('-').join('')
        };
        return newVote;
    }
    return null;
}

// This function would create new voter Id
Blockchain.prototype.createNewVoterId = function () {
    return {voterId: uuid().split('-').join('')};
}

// This function would create new Voter
Blockchain.prototype.createNewVoter = function (voterPassword, voterId) {

    let newVoter = null;

    this.chain.forEach(block => {
        block.voterIds.forEach(voter_id => {
            if(voter_id.voterId === voterId){
                newVoter = {
                    voterPassword: voterPassword,
                    voterId: voterId
                };
            }
        });
    });

    return newVoter;
}

// This function would create new Admin
Blockchain.prototype.createNewAdmin = function (adminId) {

    const newAdmin = {
        adminId: adminId
    };

    return newAdmin;
}

// This function would create new Election
Blockchain.prototype.createNewElection = function (electionName) {

    const newElection = {
        electionName: electionName,
        electionId: uuid().split('-').join('')
    };

    return newElection;
}

// This function would create new Candidate
Blockchain.prototype.createNewCandidate = function (candidateName, candidateParty, electionId, candidateImage) {

    const newCandidate = {
        candidateName: candidateName,
        candidateParty: candidateParty,
        candidateImage: candidateImage,
        electionId: electionId,
        candidateId: uuid().split('-').join('')
    };

    return newCandidate;
}

// This function would create new transation
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    // The sender and the recipient are the addresses of the sender and the recipient involved in the transaction
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj){
    this.pendingTransactions.push(transactionObj);
    // Returns the index of the block where the transaction would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addVoteToPendingVotes = function (voteObj){
    this.pendingVotes.push(voteObj);
    // Returns the index of the block where the vote would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addCandidateToPendingCandidates = function (candidateObj){
    this.pendingCandidates.push(candidateObj);
    // Returns the index of the block where the candidate would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addVoterToPendingVoters = function (voterObj){
    this.pendingVoters.push(voterObj);
    // Returns the index of the block where the voter would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addAdminToPendingAdmins = function (adminObj){
    this.pendingAdmins.push(adminObj);
    // Returns the index of the block where the admin would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addElectionToPendingElections = function (electionObj){
    this.pendingElections.push(electionObj);
    // Returns the index of the block where the election would be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addVoterIdToPendingVoterIds = function (voterIdObj){
    this.pendingVoterIds.push(voterIdObj);
    // Returns the index of the block where the voterId would be added
    return this.getLastBlock()['index'] + 1;
}


// This generates the hash of the current block to be added to the blockchain
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
}

// This will get the block matching the blockhash passed in as a parameter
Blockchain.prototype.getBlock = function (blockHash) {
    let correctBlock = null
    for (let i=0; i<this.chain.length; i++){
        if(this.chain[i].hash === blockHash){
            correctBlock = this.chain[i];
            break;
        }
    }
    return correctBlock;
};

// This method will allow us to get a specific transaction by passing a transaction id
Blockchain.prototype.getTransaction = function(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const transactions = this.chain[i].transactions;
        for (let j=0; j<transactions.length; j++){

            if(transactions[j].transactionId === transactionId){
                correctTransaction = transactions[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }
    return {
        transaction: correctTransaction,
        block: correctBlock
    };
}

// This method will allow us to get a specific vote by passing a vote id
Blockchain.prototype.getVote = function(voteId) {
    let correctVote = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const votes = this.chain[i].votes;
        for (let j=0; j<votes.length; j++){

            if(votes[j].voteId === voteId){
                correctVote = votes[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }
    return {
        vote: correctVote,
        block: correctBlock
    };
}

// This method will allow us to get a specific candidate by passing a candidate id
Blockchain.prototype.getCandiate = function(candiateId) {
    let correctcandidate = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const candidates = this.chain[i].candidates;
        for (let j=0; j<candidates.length; j++){

            if(candidates[j].candiateId === candiateId){
                correctCandidate = candidates[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }
    return {
        candidate: correctCandidate,
        block: correctBlock
    };
}

// This method will allow us to get a specific admin by passing a admin id
Blockchain.prototype.getAdmin = function(adminId) {
    let correctAdmin = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const admins = this.chain[i].admins;
        for (let j=0; j<admins.length; j++){

            if(admins[j].adminId === adminId){
                correctAdmin = admins[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }
    return {
        correctAdmin,
        correctBlock
    };
}

// This method will allow us to get a specific election by passing an election id
Blockchain.prototype.getElection = function(electionId) {
    let correctElection = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const elections = this.chain[i].elections;
        for (let j=0; j<elections.length; j++){

            if(elections[j].electionId === electionId){
                correctElection = elections[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }
    return {
        election: correctElection,
        block: correctBlock
    };
}

// This method will allow us to get a specific voter by passing an voter id
Blockchain.prototype.getVoter = function(voterId) {
    let correctVoter = null;
    let correctBlock = null;

    outerLoop:
    for (let i=0; i<this.chain.length; i++){
        const voters = this.chain[i].voters;
        for (let j=0; j<voters.length; j++){

            if(voters[j].voterId === voterId){
                correctVoter = voters[j];
                correctBlock = this.chain[i];
                break outerLoop;
            }

        }
    }

    return {
        correctVoter: correctVoter,
        block: correctBlock
    };
}

// This method will allow us to get all voterIds
Blockchain.prototype.getAllVoterIds = function() {
    let voterIds = [];

    this.chain.forEach(block => {
        block.voterIds.forEach(voterId => {
            voterIds.push(voterId);
        });
    });

    return voterIds;
}

// This is method that would get the data of a specific address
Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = [];
    const addressVotes = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if((transaction.sender == address) || (transaction.recipient === address)){
                addressTransactions.push(transaction);
            }
        });

        block.votes.forEach(vote => {
            if(vote.voterId == address){
                addressVotes.push(vote);
            }
        });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
        if(transaction.recipient === address)
            balance += transaction.amount;
        else if (transaction.sender === address)
            balance -= transaction.amount;
    });

    return {
        balance: balance,
        addressTransactions: addressTransactions,
        addressVotes: addressVotes
    };
}

// This is method that would get all votes of a specific election
Blockchain.prototype.getElectionVotes = function(electionId) {
    const electionVotes = [];
    this.chain.forEach(block => {
        block.votes.forEach(vote => {
            if(vote.electionId === electionId){
                electionVotes.push(vote);
            }
        });
    });

    return {
        electionVotes: electionVotes
    };
}

// This is method that would get all candidates of a specific election
Blockchain.prototype.getElectionCandidates = function(electionId) {
    const electionCandidates = [];
    this.chain.forEach(block => {
        block.candidates.forEach(candidate => {
            if(candidate.electionId === electionId){
                electionCandidates.push(candidate);
            }
        });
    });

    return {
        electionCandidates
    };
}

// This is method that would get all elections of a specific election
Blockchain.prototype.getAllElections = function() {
    const elections = [];
    this.chain.forEach(block => {
        block.elections.forEach(election => {
            elections.push(election);
        });
    });

    return {
        elections
    };
}

// The proof work function which is the main function that enhances the block chain technology
// We call the bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
// We constantly hash block while increasing the nonce untill an acceptable hash is gotten => "00000awuh8wg9ew87uibeugw87g38971"
// Then returns to use the nonce for the hash of the blockchain

// THEN IT SEEMS THE WAY HASHING WORKS IS THAT THE HIGHER THE DIFFICULTY THE HIGHER THE NONCE TO GET THE HASH WOULD BE
// e.g, IF THE DIFFICULTY IS 1, THEN SEVERAL NONCE COULD BE FOUND BETWEEN 0 - 100, BUT FOR A DIFFICULTY OF 4, THEN FINDING THE NONCE COULD
//      THEN BE BETWEEN 10,000 - 100,000 OR MORE SELF

// ANOTHER NOTE, THIS PROOF OF WORK IS WASTEFULL SINCE IT ONLY GENERATES THE NONCE AND NOTHING ELSE
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (!isBlockMined && hash.substring(0, this.difficulty) !== "0000"){
        nonce ++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    isBlockMined = true;
    return nonce;
}

// QUESTIONS :
//      * Is it ever possible to get a nonce very small(e.g 10), for a very high difficulty (e.g 10)

module.exports = {Blockchain, isBlockMined};
