import React, { Component } from 'react';
import { Badge, Row, Col } from 'reactstrap';
import { Route, Switch } from 'react-router-dom';
import List from './ListContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

const FundingCyclesList = () => {
    return <div>
        <Row>
            <Col md={12}>
                <List />
            </Col>
        </Row>
    </div>
}
export default class FundingCycles extends Component{
    constructor(props){
        super(props);
    };
    state = {
        selected: 'fundingcycles',
        expanded: false
    };

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    render() {
        const { expanded, selected } = this.state;
        return (
        <div>
            <div id="fundingcycles" style={{
                            marginLeft: expanded ? 200 : 64,
                            padding: '15px 20px 0 20px'
                        }}>
            <Helmet>
                <title>Funding Cycles | BocoScan</title>
                <meta name="description" content="Boco Coin incorporates on-chain governance. Come to see how on-chain governance can be achieved on Boco Coin." />
            </Helmet>
            <Row>
                <Col md={12} xs={12}><h1 className="d-none d-lg-block"><T>fundingcycles.fundingcycles</T></h1></Col>
                {/* <Col md={9} xs={12} className="text-md-right"><ChainStates /></Col> */}
            </Row>
            <Switch>
                <Route exact path="/fundingcycles" component={FundingCyclesList} />
            </Switch>
        </div>
        <SideNavigation selected="fundingcycles" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
            </div>
            )
    }

}
