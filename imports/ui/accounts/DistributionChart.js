import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import DistributionChart from "./DistributionChart.jsx";
import {AccountsNow} from "../../api/accounts/accounts";
import {ChainStates} from "../../api/chain/chain";



export default DistributionChartContainer = withTracker((props) => {
  let accountsHandle;
  let chainHandle;
  let loading = true;

  if (Meteor.isClient){
    accountsHandle = Meteor.subscribe('accounts.all');
    chainHandle = Meteor.subscribe('chainStates.latest');
    loading = !accountsHandle.ready() && !chainHandle.ready();
  }
  let accountsCond = {};

  let options = {
    sort:{
      total: -1
    },
    limit: 100
  };

  let accounts;
  let chainStates;
  let distrExist;

  let distribution = {
    supply: 0,
    t_1_25: {percent: 0, total: 0},
    t_26_50: {percent: 0, total: 0},
    t_51_75: {percent: 0, total: 0},
    t_76_100: {percent: 0, total: 0},
    t_101plus: {percent: 0, total: 0}
  };

  if (Meteor.isServer || !loading){
    accounts = AccountsNow.find(accountsCond,options).fetch();
    chainStates = ChainStates.findOne({}, {sort:{height:-1}, limit: 1});

    distribution.supply = chainStates?.totalLiquids[0]?.amount || 0;

    accounts.forEach(function(account, i) {

      let percentage = (account.total / distribution.supply) * 100;
      console.log('account.total=' + account.total + ' totalSupply=' + distribution.supply + ' percentage=' + percentage);
      if (i <= 25) {
        distribution.t_1_25.percent = distribution.t_1_25.percent + percentage;
        distribution.t_1_25.total = distribution.t_1_25.total + account.total;
      }
      if (i <= 50 && i > 25) {
        distribution.t_26_50.percent = distribution.t_26_50.percent + percentage;
        distribution.t_26_50.total = distribution.t_26_50.total + account.total;
      }
      if (i <= 75 && i > 50) {
        distribution.t_51_75.percent = distribution.t_51_75.percent + percentage;
        distribution.t_51_75.total = distribution.t_51_75.total + account.total;
      }
      if (i <= 100 && i > 75) {
        distribution.t_76_100.percent = distribution.t_76_100.percent + percentage;
        distribution.t_76_100.total = distribution.t_76_100.total + account.total;
      }
    });

    distribution.t_101plus.percent = 100 - distribution.t_76_100.percent - distribution.t_51_75.percent - distribution.t_26_50.percent - distribution.t_1_25.percent;
    distribution.t_101plus.total = distribution.supply - distribution.t_76_100.total - distribution.t_51_75.total - distribution.t_26_50.total - distribution.t_1_25.total;

    distribution.t_101plus.percent = distribution.t_101plus.percent < 0 ? 0 : distribution.t_101plus.percent;
    distribution.t_101plus.total = distribution.t_101plus.total < 0 ? 0 : distribution.t_101plus.total;

    if (Meteor.isServer){
      distrExist = !!distribution;
    }
    else{
      distrExist = !loading && !!distribution;
    }
  }



  return {
    loading,
    distrExist,
    distribution: distrExist ? distribution : {},
  };
})(DistributionChart);

