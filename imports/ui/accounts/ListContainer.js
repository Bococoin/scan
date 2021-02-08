import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {AccountsNow} from "../../api/accounts/accounts";
import {ChainStates} from "/imports/api/chain/chain";
import AccountsList from "./List.jsx";

export default AccountListContainer = withTracker((props) => {
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
    let accountsExist;

    if (Meteor.isServer || !loading){
        accounts = AccountsNow.find(accountsCond,options).fetch();
        chainStates = ChainStates.findOne({}, {sort:{height:-1}, limit: 1});

        if (Meteor.isServer){
          accountsExist = !!accounts && !!chainStates;
        }
        else{
          accountsExist = !loading && !!accounts && !!chainStates;
        }
    }

    return {
        loading,
        accountsExist,
        accounts: accountsExist ? accounts : {},
        chainStates: accountsExist ? chainStates : {}
    };
})(AccountsList);
