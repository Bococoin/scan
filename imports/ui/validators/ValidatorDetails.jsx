import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Route, Switch } from 'react-router-dom';
import Validator from './ValidatorContainer.js';
import MissedBlocks from './MissedBlocksContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import i18n from 'meteor/universe:i18n';
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

export default class ValidatorDetails extends Component{
    constructor(props){
        super(props);
    };
    state = {
        selected: 'validators',
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
            <div id="validatordetails" style={{
                        marginLeft: expanded ? 200 : 64,
                        padding: '15px 20px 0 20px'
                    }}>
            <Row>
                <Col lg={12} xs={12}><h1 className="d-none d-lg-block"><h1 className="d-none d-lg-block"></h1><T>validators.validatorDetails</T></h1></Col>
                {/* <Col lg={9} xs={12} className="text-lg-right"><ChainStates /></Col> */}
            </Row>
            <Row>
                <Col md={12}>
                    <Switch>
                        <Route exact path="/(validator|validators)/:address/missed/blocks" render={(props) => <MissedBlocks {...props} type='voter' />} />
                        <Route exact path="/(validator|validators)/:address/missed/precommits" render={(props) => <MissedBlocks {...props} type='proposer' />} />
                        <Route path="/(validator|validators)/:address" render={(props) => <Validator address={props.match.params.address} {...props}/>} />
                    </Switch>
                </Col>
            </Row>
            </div>
            <SideNavigation selected="validators" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
            </div>
            )
    }

}
