import React, {Component } from 'react';
import { MsgType } from './MsgType.jsx';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

MultiSend = (props) => {
    return <div>
        <MsgType type={props.msg.type} />
    </div>
}

export default class ButtonActivites extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let msg = this.props.msg;
        switch (msg.type){
        // bank
        case "cosmos-sdk/MsgSend":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgMultiSend":
            return <MultiSend msg={msg} />
            
            // staking
        case "cosmos-sdk/MsgCreateValidator":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgEditValidator":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgDelegate":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgUndelegate":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgBeginRedelegate":
            return <MsgType type={msg.type} />
            
            // gov
        case "cosmos-sdk/MsgSubmitProposal":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgDeposit":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgVote":
            return <MsgType type={msg.type} />
            
            // distribution
        case "cosmos-sdk/MsgWithdrawValidatorCommission":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgWithdrawDelegationReward":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/MsgModifyWithdrawAddress":
            return <MsgType type={msg.type} />
    
            // slashing
        case "cosmos-sdk/MsgUnjail":
            return <MsgType type={msg.type} />
            
            // ibc
        case "cosmos-sdk/IBCTransferMsg":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/IBCReceiveMsg":
            return <MsgType type={msg.type} />
    
        default:
            return <div>{JSON.stringify(msg.value)}</div>
        }
    }
}