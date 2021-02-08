import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import ChainStatus from './ChainStatusContainer.js';
import Consensus from './ConsensusContainer.js';
import TopValidators from './TopValidatorsContainer.js';
// import Chart from './ChartContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from "react-helmet";
import PieChart from './PieChart.js';
import SideNavigation from '../components/SideNavigation.jsx';
import Transactions from '../transactions/TransactionsList.jsx';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chainStopped: false
        }
    };
    state = {
        selected: 'dashboard',
        expanded: false
    };

    componentDidUpdate(prevProps) {
        if (prevProps.consensus != this.props.consensus) {
            if (this.props.consensus.latestBlockTime) {
                let lastSync = moment(this.props.consensus.latestBlockTime);
                let current = moment();
                let diff = current.diff(lastSync);
                if (diff > 60000) {
                    this.setState({
                        chainStopped: true
                    })
                }
                else {
                    this.setState({
                        chainStopped: false
                    })
                }
            }
        }
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
                <div id="home" style={{
                    marginLeft: expanded ? 200 : 64,
                    padding: '15px 20px 0 20px'
                }}>
                    <Helmet>
                        <title>Dashboard | BocoScan</title>
                        <meta name="description" content="Boco Coin is a decentralized network, powered by BFT consensus algorithms like Prism consensus." />
                    </Helmet>
                    {(this.state.chainStopped) ? <Card body inverse color="danger">
                        <span><T _purify={false} time={moment(this.props.consensus.latestBlockTime).fromNow(true)}>chainStatus.stopWarning</T></span>
                    </Card> : ''}
                    <Row>
                        <Col md={12}>
                            <ChainStatus />
                        </Col>
                        {/* <Col md={6}>
                            <br></br>
                            <Consensus />
                        </Col> */}
                    </Row>
                    {/* <Row>
                        <Col md={6}>
                            <TopValidators />
                        </Col>
                        <Col md={6}>
                            <PieChart />
                        </Col>
                    </Row> */}
                    <Transactions customHeader="transactions.latestTransactions" />

                </div>
                <SideNavigation selected="dashboard" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
            </div>
        )
    }

}
