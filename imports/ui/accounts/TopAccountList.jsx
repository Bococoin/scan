import React, { Component } from 'react';
import { Row, Col, Card } from 'reactstrap';
import List from './ListContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import qs from 'querystring';
import DistributionChart from "./DistributionChart";
import SideNavigation from '../components/SideNavigation.jsx';

const T = i18n.createComponent();

const PriorityEnum = {
  'total': {code: 0, dirKey: 'totalDir', name: 'total'},
  'available': {code: 1, dirKey: 'availableDir', name: 'available'},
  'delegated': {code: 2, dirKey: 'delegatedDir', name: 'delegated'},
  'unbonding': {code: 3, dirKey: 'unbondingDir', name: 'unbonding'},
  'rewards': {code: 4, dirKey: 'rewardsDir', name: 'rewards'},
};

const renderToggleIcon = (order) =>
  <i className="material-icons marginleft"> {(order == 1)?'arrow_drop_up':'arrow_drop_down'}</i>;

export default class TopAccounts extends Component{
  constructor(props){
    super(props);
    let state = {
      totalDir: -1,
      availableDir: 1,
      delegatedDir: -1,
      unbondingDir: -1,
      rewardsDir: -1,
      priority: PriorityEnum.total.code
    };
    if (props.location.search) {
      let queryParams = qs.parse(props.location.search.substring(1));
      let sortField = queryParams.sort;
      if (sortField && PriorityEnum[sortField]) {
        state.priority = PriorityEnum[sortField].code;
        if (queryParams.dir && Number(queryParams.dir)) {
          state[PriorityEnum[sortField].dirKey] = Number(queryParams.dir) > 0?1:-1;
        }
      }
    }
    this.state = state;
  };
  state = {
    selected: 'top',
    expanded: false
  };

  toggleDir(field, e){
    e.preventDefault();
    if (!PriorityEnum[field])
      return;

    let dirKey = PriorityEnum[field].dirKey;
    let newDir = this.state[dirKey] * -1;
    this.setState({
      [dirKey]: newDir,
      priority: PriorityEnum[field].code
    });
    this.props.history.replace({
      search: qs.stringify({
        sort: field,
        dir: newDir
      })
    });
  };

  onSelect = (selected) => {
    this.setState({ selected: selected });
  };

  onToggle = (expanded) => {
    this.setState({ expanded: expanded });
  };

  render() {
    const { expanded, selected } = this.state;
    let title = <T>accounts.topTitle</T>;
    let desc = <T>accounts.topDescription</T>;


    return (
      <div>
        <div id="account-list" style={{
          marginLeft: expanded ? 200 : 64,
          padding: '15px 20px 0 20px'
        }}>
          <Helmet>
            <title>Top 100 Accounts | BocoScan</title>
            <meta name="description" content="Here is a list of Top 100 Boco Accounts" />
          </Helmet>
          {/* <Row> */}
            {/* <Col lg={12} xs={12}><h1 className="d-none d-lg-block">{title}</h1></Col> */}
            {/* <Col lg={9} xs={12} className="text-lg-right"><ChainStates /></Col> */}
          {/* </Row> */}
          <Row className="validator-list">
            <div class="col-12 table-name"><T>accounts.topTitle</T></div>
            <Col xs={{size:12, order: 'first'}} lg={{size:4,order:'last'}}>
              <DistributionChart />
            </Col>
            <Col xs={12} lg={8}>
              <Card body className="border-0 shadow-none bg-transparent">
                <Row className="header text-nowrap">
                  {/* <Col className="d-none d-md-block counter text-center noflex"  xs={1} >#</Col> */}

                  <Col className="address text-center noflex" xs={12} sm={5} >
                    <span className="d-inline-block">
                      <T>accounts.address</T>
                    </span>
                  </Col>

                  <Col className="total-coins text-center noflex"     xs={8} sm={4} >
                    <span className="d-lg-inline-block">
                      <T>accounts.total</T>
                    </span>
                  </Col>

                  <Col className="percents text-center noflex"        xs={4} sm={2}>
                    <span className="d-inline-block">
                      <T>accounts.percents</T>
                    </span>
                  </Col>
                </Row>
              </Card>
              <List
                totalDir={this.state.totalDir}
                availableDir={this.state.availableDir}
                delegatedDir={this.state.delegatedDir}
                unbounedDir={this.state.unbondingDir}
                rewardsDir={this.state.rewardsDir}
                priority={this.state.priority}
              />
            </Col>
          </Row>
        </div>
        <SideNavigation selected="top" onToggle={this.onToggle} history={this.props.history}></SideNavigation>
      </div>
    )
  }

}
