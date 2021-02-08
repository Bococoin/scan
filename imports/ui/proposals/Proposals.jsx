import React, { Component } from 'react';
import { Badge, Row, Col } from 'reactstrap';
import { Route, Switch } from 'react-router-dom';
import List from './ListContainer.js';
import Proposal from './ProposalContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

const ProposalList = () => {
    return <div>
        {/* <p className="lead"><T>proposals.listOfProposals</T></p> */}
        <Row>
            <Col md={12}>
                <List />
            </Col>
        </Row>
    </div>
}
export default class Proposals extends Component{
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

    render() {
        const { expanded, selected } = this.state;
        return (
        <div>
            <div id="proposals" style={{
                            marginLeft: expanded ? 200 : 64,
                            padding: '15px 20px 0 20px'
                        }}>
            <Helmet>
                <title>Proposals | BocoScan</title>
                <meta name="description" content="BocoScan incorporates on-chain governance. Come to see how on-chain governance can be achieved on BocoScan." />
            </Helmet>
            <Row>
                <Col md={12} xs={12}><h1 className="d-none d-lg-block"><T>proposals.proposals</T></h1></Col>
                {/* <Col md={9} xs={12} className="text-md-right"><ChainStates /></Col> */}
            </Row>
            <Switch>
                <Route exact path="/proposals" component={ProposalList} />
                <Route path="/proposals/:id" component={Proposal} />
            </Switch>
        </div>
        <SideNavigation selected="proposals" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
            </div>
            )
    }

}
