import Transactions from "./TransactionsList";
import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import List from './ListContainer.js';
import { LoadMore } from '../components/LoadMore.jsx';
import { Meteor } from 'meteor/meteor';
import { Route, Switch } from 'react-router-dom';
import Transaction from './TransactionContainer.js';
import Sidebar from "react-sidebar";
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

export default class Movements extends Transactions {
  constructor(props){
    super(props);

    this.state = {
        limit: Meteor.settings.public.initialPageSize,
        monikerDir: 1,
        votingPowerDir: -1,
        uptimeDir: -1,
        proposerDir: -1,
        priority: 2,
        loadmore: false,
        sidebarOpen: (props.location.pathname.split("/movement/").length == 2)
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  };

  state = {
    selected: 'movement',
    expanded: false
  };

  componentDidUpdate(prevProps){
    if (this.props.location.pathname != prevProps.location.pathname){
        this.setState({
            sidebarOpen: (this.props.location.pathname.split("/movement/").length == 2)
        })
    }
  }

  render(){
    const { expanded, selected } = this.state;
    return (
    <div>
    <div id="transactions" style={{
                    marginLeft: expanded ? 200 : 64,
                    padding: '15px 20px 0 20px'
                }}>
        <Helmet>
            <title>Movement | BocoScan</title>
            <meta name="description" content="See what is happening Boco" />
        </Helmet>
        {/* <Row> */}
            {/* <Col md={12} xs={12}><h1 className="d-none d-lg-block"><T>transactions.movement</T></h1></Col> */}
            {/* <Col md={9} xs={12} className="text-md-right"><ChainStates /></Col> */}
        {/* </Row> */}
        <Switch>
            <Route path="/transactions/:txId" render={(props)=> <Sidebar 
                sidebar={<Transaction {...props} />}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                styles={{ sidebar: { 
                    background: "white", 
                    position: "fixed",
                    width: '85%',
                    zIndex: 4
                }, overlay: {
                    zIndex: 3
                } }}
            >
            </Sidebar>} />
        </Switch>
        <List limit={this.state.limit} customHeader="transactions.movement" />
        <LoadMore show={this.state.loadmore} />
        </div>
        <SideNavigation selected="movement" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
        </div>
        )
}
}