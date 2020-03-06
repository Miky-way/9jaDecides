const Blockchain = require('./blockchain');

const greencoin = new Blockchain();

const bc1 = {
"chain": [
{
"index": 1,
"timestamp": 1554702679865,
"transactions": [],
"nonce": 0,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1554702715670,
"transactions": [],
"nonce": 18140,
"hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1554702893917,
"transactions": [
{
"amount": 10,
"sender": "00",
"recipient": "5526947059c211e994eccb99f4de5294",
"transactionId": "6ab7aae059c211e994eccb99f4de5294"
},
{
"amount": 21,
"sender": "jkniuosnonfoijfsjnsiunjs",
"recipient": "oihewu8hje8w9hnesnugs87guig78wg",
"transactionId": "b07b513059c211e994eccb99f4de5294"
},
{
"amount": 121,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "c3ee1b8059c211e994eccb99f4de5294"
}
],
"nonce": 11102,
"hash": "0000804a3c042d3cfcfc44e868abe3c562c3c16c2c7db3e1c04f1706ef0a2982",
"previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
},
{
"index": 4,
"timestamp": 1554702947999,
"transactions": [
{
"amount": 10,
"sender": "00",
"recipient": "5526947059c211e994eccb99f4de5294",
"transactionId": "d4bd642059c211e994eccb99f4de5294"
},
{
"amount": 1,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "e3d9cca059c211e994eccb99f4de5294"
},
{
"amount": 10,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "e79aa53059c211e994eccb99f4de5294"
},
{
"amount": 10,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "e9c3037059c211e994eccb99f4de5294"
},
{
"amount": 330,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "ed31011059c211e994eccb99f4de5294"
},
{
"amount": 80,
"sender": "ewuiwbheyytagfyraukyfyurfayuf",
"recipient": "brawyugrabkyewvbrfyubwfyeu",
"transactionId": "f1b3a30059c211e994eccb99f4de5294"
}
],
"nonce": 59158,
"hash": "0000cde965c8e2541e9b62a9a951646203c5a9c0205ded91527ad548e29e4c37",
"previousBlockHash": "0000804a3c042d3cfcfc44e868abe3c562c3c16c2c7db3e1c04f1706ef0a2982"
},
{
"index": 5,
"timestamp": 1554702958158,
"transactions": [
{
"amount": 10,
"sender": "00",
"recipient": "5526947059c211e994eccb99f4de5294",
"transactionId": "f4f97f3059c211e994eccb99f4de5294"
}
],
"nonce": 124283,
"hash": "0000814c271a08d65a80f9cdb14f9fd77c94edf30f29b6eab0cf0297ff825b4b",
"previousBlockHash": "0000cde965c8e2541e9b62a9a951646203c5a9c0205ded91527ad548e29e4c37"
},
{
"index": 6,
"timestamp": 1554702960950,
"transactions": [
{
"amount": 10,
"sender": "00",
"recipient": "5526947059c211e994eccb99f4de5294",
"transactionId": "fb0929c059c211e994eccb99f4de5294"
}
],
"nonce": 38079,
"hash": "0000dda43417bec7a73ba73ea2c5704720981e6dd17c0b23748eacdab7bc03b6",
"previousBlockHash": "0000814c271a08d65a80f9cdb14f9fd77c94edf30f29b6eab0cf0297ff825b4b"
}
],
"pendingTransactions": [
{
"amount": 10,
"sender": "00",
"recipient": "5526947059c211e994eccb99f4de5294",
"transactionId": "fcb1829059c211e994eccb99f4de5294"
}
],
"difficulty": 4,
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};

console.log('Valid : '+greencoin.chainIsValid(bc1.chain));
