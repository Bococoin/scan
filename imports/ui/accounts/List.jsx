import React, {Component} from 'react';
import {Badge, Progress, Row, Col, Card, Spinner} from 'reactstrap';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {Meteor} from 'meteor/meteor';
import numbro from 'numbro';
import Avatar from '../components/Avatar.jsx';

const AccountRow = (props) => {
  let moniker = `${props.address.slice(0, 15)}...${props.address.slice(-6)}`

  return <Row className="validator-info">
      {/* <Col className="d-none d-md-block counter data" xs={1}>{props.index + 1}</Col> */}
      <Col className="acc-addr data text-truncate text-left" xs={12} sm={5}>
        <Link to={"/account/" + props.address}>
          <span className="moniker">{moniker}</span>
        </Link>
      </Col>
      <Col className="total data" xs={8} sm={4}>
        <span>{numbro(props.total / Meteor.settings.public.stakingFraction).format(window.config.numbers.withDecimalWithSpace)} {Meteor.settings.public.stakingDenom}</span>
      </Col>
      <Col className="percents data" xs={4} sm={2}>
        <span>{numbro(props.total / props.totalSupply).format(window.config.numbers.percentWithDecimals)}</span>
      </Col>
    </Row>
};

export default class AccountsList extends Component {
  constructor(props) {
    super(props);

    if (Meteor.isServer) {
      console.log('AccountList constructor props: ' + JSON.stringify(this.props));
      if (this.props.accounts.length > 0 && this.props.chainStates) {
        this.state = {
          accounts: this.props.accounts.map((account, i) => {
            return <AccountRow
              key={account.address}
              index={i}
              total={account.total}
              available={account.available}
              address={account.address}
              unbonding={account.unbonding}
              delegated={account.delegated}
              reward={account.reward}
              totalSupply={this.props.chainStates.totalLiquids[0].amount}
            />
          })
        }
      }
    }
    else {
      this.state = {
        accounts: ""
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.accounts != prevProps.accounts) {
      console.log('AccountList update props: ' + JSON.stringify(this.props));
      if (this.props.accounts.length > 0 && this.props.chainStates) {
        this.setState({
          accounts: this.props.accounts.map((account, i) => {
            return <AccountRow
              key={account.address}
              index={i}
              total={account.total}
              available={account.available}
              address={account.address}
              unbonding={account.unbonding}
              delegated={account.delegated}
              reward={account.reward}
              totalSupply={this.props.chainStates.totalLiquids[0].amount}
            />
          })
        })
      }
      else {
        this.setState({
          accounts: ""
        })
      }
    }
  }

  render() {
    if (this.props.loading) {
      return <Spinner type="grow" color="primary"/>
    }
    else {
      return (
        this.state.accounts
      )
    }
  }
}
