const Web3 = require('web3');

let web3 = new Web3('https://bsc-dataseed1.ninicoin.io/');

if (process.env.TESTNET) {
  web3 = new Web3('https://data-seed-prebsc-2-s1.binance.org:8545/');
}
module.exports = web3;
