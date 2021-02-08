import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TwentyEighty from './TwentyEightyContainer.js';
import ThirtyFour from './ThirtyFourContainer.js';
import VotingPower from './VotingPowerContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

export default class Distribution extends Component{
    constructor(props){
        super(props);
    };
    state = {
        selected: 'proposals',
        expanded: false
    };

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    render(){
        const { expanded, selected } = this.state;
        return (
        <div>
            <div id="voting-power-dist" style={{
                            marginLeft: expanded ? 200 : 64,
                            padding: '15px 20px 15px 20px'
                        }}>
            <Helmet>
                <title>Delegation Distribution | BocoScan</title>
                <meta name="description" content="We would like to keep track how delegations are distributed over time among validators." />
            </Helmet>
            <Row>
                <Col md={12} xs={12}><h1 className="d-none d-lg-block"><T>votingPower.distribution</T></h1></Col>
                {/* <Col md={9} xs={12} className="text-md-right"><ChainStates /></Col> */}
            </Row>
            <Row>
                <Col md={6}><TwentyEighty /></Col>
                <Col md={6}><ThirtyFour /></Col>
            </Row>
            <Row>
                <Col>
                    <VotingPower />
                </Col>
            </Row>
        </div>
        <SideNavigation selected="proposals" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
            </div>
            )
    }
}
