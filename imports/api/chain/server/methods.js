import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';
import {getAddress} from 'tendermint/lib/pubkey.js';
import {Chain, ChainStates} from '../chain.js';
import {Validators} from '../../validators/validators.js';
import {VotingPowerHistory} from '../../voting-power/history.js';
import {ValidatorSets} from "../../validator-sets/validator-sets";
import {CoinStats} from "../../coin-stats/coin-stats";
import {Delegations} from "../../delegations/delegations";
import {Transactions} from "../../transactions/transactions";
import {Evidences} from "../../evidences/evidences";
import {
  Analytics,
  AverageData,
  AverageValidatorData,
  MissedBlocksStats,
  ValidatorRecords,
  VPDistributions
} from "../../records/records";
import {Status} from "../../status/status";
import {Blockscon} from "../../blocks/blocks";
import {AccountsNow} from "../../accounts/accounts";

findVotingPower = (validator, genValidators) => {
  for (let v in genValidators) {
    if (validator.pub_key.value == genValidators[v].pub_key.value) {
      return parseInt(genValidators[v].power);
    }
  }
}

Meteor.methods({
  'chain.getConsensusState': function () {
    this.unblock();
    let url = RPC + '/dump_consensus_state';
    try {
      let response = HTTP.get(url);
      let consensus = JSON.parse(response.content);
      consensus = consensus.result;
      let height = consensus.round_state.height;
      let round = consensus.round_state.round;
      let step = consensus.round_state.step;
      let votedPower = Math.round(parseFloat(consensus.round_state.votes[round].prevotes_bit_array.split(" ")[3]) * 100);

      Chain.update({chainId: Meteor.settings.public.chainId}, {
        $set: {
          votingHeight: height,
          votingRound: round,
          votingStep: step,
          votedPower: votedPower,
          proposerAddress: consensus.round_state.validators.proposer.address,
          prevotes: consensus.round_state.votes[round].prevotes,
          precommits: consensus.round_state.votes[round].precommits
        }
      });
    }
    catch (e) {
      console.log(e);
    }
  },
  'chain.updateStatus': function () {
    this.unblock();
    let url = RPC + '/status';
    try {
      let response = HTTP.get(url);
      let status = JSON.parse(response.content);
      status = status.result;
      let chain = {};
      chain.chainId = status.node_info.network;
      chain.latestBlockHeight = status.sync_info.latest_block_height;
      chain.latestBlockTime = status.sync_info.latest_block_time;

      url = RPC + '/validators';
      response = HTTP.get(url);
      let validators = JSON.parse(response.content);
      validators = validators.result.validators;
      chain.validators = validators.length;
      let activeVP = 0;
      for (v in validators) {
        activeVP += parseInt(validators[v].voting_power);
      }
      chain.activeVotingPower = activeVP;

      // Get chain states
      if (parseInt(chain.latestBlockHeight) > 0) {
        let chainStates = {};
        chainStates.height = parseInt(status.sync_info.latest_block_height);
        chainStates.time = new Date(status.sync_info.latest_block_time);

        url = LCD + '/staking/pool';
        try {
          response = HTTP.get(url);
          let bonding = JSON.parse(response.content);
          //chain.bondedTokens = bonding.bonded_tokens;
          //chain.notBondedTokens = bonding.not_bonded_tokens;
          chainStates.bondedTokens = parseInt(bonding.result.bonded_tokens);
          chainStates.notBondedTokens = parseInt(bonding.result.not_bonded_tokens);
        }
        catch (e) {
          console.log(e);
        }

        url = LCD + '/distribution/community_pool';
        try {
          response = HTTP.get(url);
          let pool = JSON.parse(response.content);
          pool = pool.result;
          if (pool && pool.length > 0) {
            chainStates.communityPool = [];
            pool.forEach((amount, i) => {
              chainStates.communityPool.push({
                denom: amount.denom,
                amount: parseFloat(amount.amount)
              })
            })
          }
        }
        catch (e) {
          console.log(e)
        }

        url = LCD + '/supply/total';
        try{
          response = HTTP.get(url);
          let total = JSON.parse(response.content);
          total = total.result;
          if (total && total.length > 0) {
            chainStates.totalLiquids = [];
            total.forEach((amount, i) => {
              chainStates.totalLiquids.push({
                denom: amount.denom,
                amount: parseFloat(amount.amount)
              })
            })
          }
        }
        catch(e){
          console.log(e);
        }

        url = LCD + '/minting/reward';
        try {
          response = HTTP.get(url);
          let reward = JSON.parse(response.content);
          if (reward.result) {
            chainStates.minting = parseFloat(reward.result)
          }
        }
        catch (e) {
          console.log(e);
        }

        /*url = LCD + '/minting/minting-speed';
        try{
            response = HTTP.get(url);
            let minting = JSON.parse(response.content);
            if (minting){
                chainStates.minting = parseFloat(minting)
            }
        }
        catch(e){
            console.log(e);
        }*/

        // url = LCD + '/minting/annual-provisions';
        // try{
        //     response = HTTP.get(url);
        //     let provisions = JSON.parse(response.content);
        //     if (provisions){
        //         chainStates.annualProvisions = parseFloat(provisions)
        //     }
        // }
        // catch(e){
        //     console.log(e);
        // }
        ChainStates.update({height: chainStates.height}, chainStates, {upsert: true});
        // ChainStates.insert(chainStates);
      }

      //chain.totalVotingPower = totalVP;

      Chain.update({chainId: chain.chainId}, {$set: chain}, {upsert: true});

      validators = Validators.find({}).fetch();
      //console.log(validators);
      return chain.latestBlockHeight;
    }
    catch (e) {
      console.log(e);
      return "Error getting chain status.";
    }
  },
  'chain.getLatestStatus': function () {
    Chain.find().sort({created: -1}).limit(1);
  },
  'chain.genesis': function () {

    if (RESYNC) {
      console.log('===!!! Clear DB. !!!===')
      Chain.remove({});
      Validators.remove({});
      ValidatorSets.remove({});
      VotingPowerHistory.remove({});
      Transactions.remove({});
      Delegations.remove({});
      CoinStats.remove({});
      Evidences.remove({});
      ValidatorRecords.remove({});
      Analytics.remove({});
      MissedBlocksStats.remove({});
      VPDistributions.remove({});
      AverageData.remove({});
      AverageValidatorData.remove({});
      Status.remove({});
      Blockscon.remove({});
      ChainStates.remove({});
      AccountsNow.remove({});
    }

    let chain = Chain.findOne({chainId: Meteor.settings.public.chainId});

    if (chain && chain.readGenesis) {
      console.log('Genesis file has been processed');
    }
    else {
      console.log('=== Start processing genesis file ===');

      let response = HTTP.get(Meteor.settings.genesisFile);
      let genesis = JSON.parse(response.content);
      genesis = genesis.result.genesis;

      let chainParams = {
        chainId: genesis.chain_id,
        genesisTime: genesis.genesis_time,
        consensusParams: genesis.consensus_params,
        auth: genesis.app_state.auth,
        bank: genesis.app_state.bank,
        staking: {
          pool: genesis.app_state.staking.pool,
          params: genesis.app_state.staking.params
        },
        mint: genesis.app_state.bocomint,
        distr: {
          communityTax: genesis.app_state.distribution.params.community_tax,
          baseProposerReward: genesis.app_state.distribution.params.base_proposer_reward,
          bonusProposerReward: genesis.app_state.distribution.params.bonus_proposer_reward,
          withdrawAddrEnabled: genesis.app_state.distribution.params.withdraw_addr_enabled
        },
        gov: {
          startingProposalId: genesis.app_state.gov.starting_proposal_id,
          depositParams: genesis.app_state.gov.deposit_params,
          votingParams: genesis.app_state.gov.voting_params,
          tallyParams: genesis.app_state.gov.tally_params
        },
      };

      let totalVotingPower = 0;

      // read gentx
      if (genesis.app_state.gentxs && (genesis.app_state.gentxs.length > 0)) {
        for (i in genesis.app_state.gentxs) {
          let msg = genesis.app_state.gentxs[i].value.msg;
          // console.log(msg.type);
          for (m in msg) {
            if (msg[m].type == "cosmos-sdk/MsgCreateValidator") {
              console.log(msg[m].value);
              // let command = Meteor.settings.bin.gaiadebug+" pubkey "+msg[m].value.pubkey;
              let validator = {
                consensus_pubkey: msg[m].value.pubkey,
                description: msg[m].value.description,
                commission: msg[m].value.commission,
                min_self_delegation: msg[m].value.min_self_delegation,
                operator_address: msg[m].value.validator_address,
                delegator_address: msg[m].value.delegator_address,
                voting_power: Math.floor(parseInt(msg[m].value.value.amount) / Meteor.settings.public.stakingFraction),
                jailed: false,
                status: 2
              }

              totalVotingPower += validator.voting_power;

              let pubkeyValue = Meteor.call('bech32ToPubkey', msg[m].value.pubkey);
              // Validators.upsert({consensus_pubkey:msg[m].value.pubkey},validator);

              validator.pub_key = {
                "type": "tendermint/PubKeyEd25519",
                "value": pubkeyValue
              }

              validator.address = getAddress(validator.pub_key);
              validator.accpub = Meteor.call('pubkeyToBech32', validator.pub_key, Meteor.settings.public.bech32PrefixAccPub);
              validator.operator_pubkey = Meteor.call('pubkeyToBech32', validator.pub_key, Meteor.settings.public.bech32PrefixValPub);
              VotingPowerHistory.insert({
                address: validator.address,
                prev_voting_power: 0,
                voting_power: validator.voting_power,
                type: 'add',
                height: 0,
                block_time: genesis.genesis_time
              });

              Validators.insert(validator);
            }
          }
        }
      }

      // read validators from previous chain
      console.log('read validators from previous chain');
      if (genesis.app_state.staking.validators && genesis.app_state.staking.validators.length > 0) {
        console.log(genesis.app_state.staking.validators.length);
        let genValidatorsSet = genesis.app_state.staking.validators;
        let genValidators = genesis.validators;
        for (let v in genValidatorsSet) {
          // console.log(genValidators[v]);
          let validator = genValidatorsSet[v];
          validator.delegator_address = Meteor.call('getDelegator', genValidatorsSet[v].operator_address);

          let pubkeyValue = Meteor.call('bech32ToPubkey', validator.consensus_pubkey);

          validator.pub_key = {
            "type": "tendermint/PubKeyEd25519",
            "value": pubkeyValue
          }

          validator.address = getAddress(validator.pub_key);
          validator.pub_key = validator.pub_key;
          validator.accpub = Meteor.call('pubkeyToBech32', validator.pub_key, Meteor.settings.public.bech32PrefixAccPub);
          validator.operator_pubkey = Meteor.call('pubkeyToBech32', validator.pub_key, Meteor.settings.public.bech32PrefixValPub);

          validator.voting_power = findVotingPower(validator, genValidators);
          totalVotingPower += validator.voting_power;

          Validators.upsert({consensus_pubkey: validator.consensus_pubkey}, validator);
          VotingPowerHistory.insert({
            address: validator.address,
            prev_voting_power: 0,
            voting_power: validator.voting_power,
            type: 'add',
            height: 0,
            block_time: genesis.genesis_time
          });
        }
      }

      chainParams.readGenesis = true;
      chainParams.activeVotingPower = totalVotingPower;
      let result = Chain.upsert({chainId: chainParams.chainId}, {$set: chainParams});


      console.log('=== Finished processing genesis file ===');

    }

    return true;
  }
})
