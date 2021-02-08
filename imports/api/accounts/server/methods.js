import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {AccountsNow} from "../accounts";


Meteor.methods({
  'accounts.getBalance': function (address) {
    this.unblock();
    let balance = {}
    // get available bcc
    let url = LCD + '/bank/balances/' + address;
    try {
      let available = HTTP.get(url);
      if (available.statusCode == 200) {
        // console.log(JSON.parse(available.content))
        bAv = JSON.parse(available.content);
        balance.available = bAv.result;
        if (balance.available && balance.available.length > 0)
          balance.available = balance.available[0];
      }
    }
    catch (e) {
      console.log(e)
    }

    // get delegated amnounts
    url = LCD + '/staking/delegators/' + address + '/delegations';
    try {
      let delegations = HTTP.get(url);
      if (delegations.statusCode == 200) {
        del = JSON.parse(delegations.content);
        balance.delegations = del.result;
      }
    }
    catch (e) {
      console.log(e);
    }
    // get unbonding
    url = LCD + '/staking/delegators/' + address + '/unbonding_delegations';
    try {
      let unbonding = HTTP.get(url);
      if (unbonding.statusCode == 200) {
        unb = JSON.parse(unbonding.content);
        balance.unbonding = unb.result;
      }
    }
    catch (e) {
      console.log(e);
    }

    // get rewards
    url = LCD + '/distribution/delegators/' + address + '/rewards';
    try {
      let rewards = HTTP.get(url);
      if (rewards.statusCode == 200) {
        rew = JSON.parse(rewards.content);
        balance.rewards = rew.result;
      }
    }
    catch (e) {
      console.log(e);
    }

    return balance;
  },
  'accounts.getAccountInfo': function (address) {
    url = LCD + '/auth/accounts/' + address;
    try {
      let responce = HTTP.get(url);
      if (responce.statusCode == 200) {
        acc = JSON.parse(responce.content);
        return acc.result;
      }
    }
    catch (e) {
      console.log(e);
    }
  },
  'accounts.updateAccountsFromTx': function (tx) {
    let txAddrs = new Set();
    for (l in tx.logs) {
      for (e in tx.logs[l].events) {
        for (a in tx.logs[l].events[e].attributes) {
          let atr = tx.logs[l].events[e].attributes[a];
          if (atr && atr.value && atr.value.startsWith('boco1')) {
            txAddrs.add(atr.value);
          }
        }
      }
    }
    txAddrs.forEach(adr => {
      Meteor.call('accounts.getAccountInfo', adr, (err, accInfo) => {
        if(err){
          console.log(err);
        } else if(accInfo && accInfo.type === 'cosmos-sdk/Account') {
          Meteor.call('accounts.getBalance', adr, (err, balance) => {
            if (err) {
              console.log(err);
            } else {
              console.log('account update: ' + adr);

              let delegated = 0;
              let unbonding = 0;
              let reward = 0;

              let available = parseInt(balance.available.amount);
              for (d in balance.delegations) {
                delegated += parseInt(balance.delegations[d].balance.amount);
              }
              for (u in balance.unbonding) {
                for (e in balance.unbonding[u].entries) {
                  unbonding += parseInt(balance.unbonding[u].entries[e].balance);
                }
              }

              if (balance.rewards && balance.rewards.total && balance.rewards.total[0]) { //total - array. Get first, because boco has only one denom
                reward = parseFloat(balance.rewards.total[0].amount);
              }

              let total = available + delegated + unbonding + reward;

              AccountsNow.update(
                {address: adr},
                {
                  address: adr,
                  available: available,
                  delegated: delegated,
                  unbonding: unbonding,
                  reward: reward,
                  total: total
                },
                {upsert: true});
            }
          })
        } else {
          console.log('account.type = ' + accInfo.type);
        }
      })
    });
  },
  'accounts.getAddressBalance': function (address) {
    return AccountsNow.findOne({address: address});
  },
  'accounts.getAllDelegations'(address) {
    let url = LCD + '/staking/delegators/' + address + '/delegations';

    try {
      let delegations = HTTP.get(url);
      if (delegations.statusCode == 200) {
        delegations = JSON.parse(delegations.content);
        delegations = delegations.result;
        if (delegations && delegations.length > 0) {
          delegations.forEach((delegation, i) => {
            if (delegations[i] && delegations[i].shares)
              delegations[i].shares = parseFloat(delegations[i].shares);
          })
        }

        return delegations;
      }
      ;
    }
    catch (e) {
      console.log(e);
    }
  },
  'accounts.getAllUnbondings'(address) {
    let url = LCD + '/staking/delegators/' + address + '/unbonding_delegations';

    try {
      let unbondings = HTTP.get(url);
      if (unbondings.statusCode == 200) {
        unbondings = JSON.parse(unbondings.content);
        return unbondings.result;
      }
      ;
    }
    catch (e) {
      console.log(e);
    }
  }
})
