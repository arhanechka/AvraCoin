// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'
// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
// Import our contract artifacts and turn them into usable abstractions.
import Avracoincrowdsale_artifacts from '../../build/contracts/Crowdsale.json'
import Avracoin_artifacts from '../../build/contracts/AvraToken.json'
// MetaCoin is our usable abstraction, which we'll use through the code below.
var AvraCoinCrowdsale = contract(Avracoincrowdsale_artifacts)
var AvraCoin = contract(Avracoin_artifacts)
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account
var account1

window.App = {
  start: function () {
    var self = this

    // Bootstrap the MetaCoin abstraction for Use.
    AvraCoinCrowdsale.setProvider(web3.currentProvider)
    AvraCoin.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length == 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]
      account1 = accounts[1]
      console.log(account)

      self.refreshBalance()
    })
  },
  getAvraCoinInstance: function (callback) {
    var crowdsale = AvraCoinCrowdsale.deployed() //crowdsale is a promise

    crowdsale.then(crowdsaleContract => {//crowdsaleContract is Truffle contract with fields and methods
      console.log('result address ' + crowdsaleContract.address)
      console.log(crowdsaleContract)
      crowdsaleContract.token() //call method token() of contract AvraCrowdsale
        .then(tokenAddress => { // tokenAddress is a result of method token(). It creates new Avracoin and returns it's address
          console.log('tokenAddress')
          console.log(tokenAddress)
          AvraCoin.at(tokenAddress)
            .then(AvracoinContract => { //AvracoinContract is a Truffle contract with fields and methods
              console.log('AvracoinContract')
              console.log(AvracoinContract)
              callback(AvracoinContract)//return instance of AvraCoin in callback
            })
        })

    })
  },

  setStatus: function (message) {
    var status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    var self = this
    var crowdsale = AvraCoinCrowdsale.deployed() //crowdsale is a promise

    function  getAvraCoinInstance  (callback) {
      var crowdsale = AvraCoinCrowdsale.deployed() //crowdsale is a promise

      crowdsale.then(crowdsaleContract => {//crowdsaleContract is Truffle contract with fields and methods
        console.log('result address ' + crowdsaleContract.address)
        console.log(crowdsaleContract)
        crowdsaleContract.token() //call method token() of contract AvraCrowdsale
          .then(tokenAddress => { // tokenAddress is a result of method token(). It creates new Avracoin and returns it's address
            console.log('tokenAddress')
            console.log(tokenAddress)
            AvraCoin.at(tokenAddress)
              .then(AvracoinContract => { //AvracoinContract is a Truffle contract with fields and methods
                console.log('AvracoinContract')
                console.log(AvracoinContract)
                callback(AvracoinContract)//return instance of AvraCoin in callback
              })
          })

      })}
    function getAvraCoinBalance (account) {
      getAvraCoinInstance(function (globalAvraCoinContract) { //call function which returns instance of AvraCoin
        console.log('AvracoinContract!!!!!')
        console.log(globalAvraCoinContract)
        globalAvraCoinContract.balanceOf(account).then(balance => { //get balance of my account in AvraCoin
          console.log(balance.toString(10))
          // var temp = web3.utils.fromWei(balance);
          // console.log(temp)

          var balance_element = document.getElementById("balance");
          balance_element.innerHTML = balance.toString(10);
          balance.toString(10)
        })
      })
    }

    getAvraCoinBalance(account);
    // AvraCoinCrowdsale.deployed()
    //   .then(inst => {
    //       console.log("This is instance")
    //       console.log(inst)
    //       inst.sendTransaction({ from: account, value: web3.toWei(5, "ether")});})
   // self.refreshBalance();
  },


  sendCoin: function() {
    var self = this;
    var amount = parseInt(document.getElementById("amount").value);
    AvraCoinCrowdsale.deployed()
      .then(inst => {
        console.log("This is instance")
        console.log(inst)
        inst.sendTransaction({ from: account, value: web3.toWei(amount, "ether")});
        self.refreshBalance();
      })
    //  var receiver = document.getElementById("receiver").value;
    //  function transferCoins(){
    //   self.getAvraCoinInstance(function (globalAvraCoinContract){
    //     globalAvraCoinContract.transferFrom({from: account}, {to: receiver}, amount);
    //    // this.setStatus("Initiating transaction... (please wait)");
    //  //   self.setStatus("Transaction complete!");
    //     self.refreshBalance();})
    //   }
    //   transferCoins();

  },
  transferCoin: function() {
    var self = this;
    var amount = parseInt(document.getElementById("amount1").value);
    var receiver = document.getElementById("receiver").value;
    //  function transferCoins(){
    //   self.getAvraCoinInstance(function (globalAvraCoinContract){
    //     globalAvraCoinContract.transfer({from: account}, {to: receiver}, amount);
    //    // this.setStatus("Initiating transaction... (please wait)");
    //  //   self.setStatus("Transaction complete!");
    //     self.refreshBalance();})
    //   }
    //   transferCoins();

  }

};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask')
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
