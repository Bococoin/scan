import {Meteor} from "meteor/meteor";
import {AccountsNow} from "../accounts";

Meteor.publish('accounts.all', function () {
  return AccountsNow.find({});
});