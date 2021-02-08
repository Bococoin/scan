import React, { Component } from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

export default class SideNavigation extends Component {
  constructor(props) {
    super(props);
  };

  state = {
    selected: this.props.selected,
    expanded: false
  };

  onSelect = (selected) => {
    this.setState({ selected: selected });
  };

  onToggle = (expanded) => {
    this.setState({ expanded: expanded });
    this.props.onToggle(expanded);
  };

  render() {
    const { expanded, selected } = this.state;
    return (
      <SideNav className="sidenav position-fixed" onSelect={this.onSelect} onToggle={this.onToggle}>
        <SideNav.Toggle />
        <SideNav.Nav selected={selected} defaultSelected={selected}>
          <NavItem eventKey="dashboard" onClick={e => this.props.history.push("/")} title="Dashboard">
            <NavIcon>
              <i className="fa fa-fw fa-home" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              <span className="nav-item__text">Dashboard</span>
            </NavText>
          </NavItem>
          <NavItem eventKey="blocks" onClick={e => this.props.history.push("/blocks")} title="Blocks">
            <NavIcon>
              <i className="fa fa-fw fa-th" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              <span className="nav-item__text">Blocks</span>
            </NavText>
          </NavItem>
          <NavItem eventKey="transactions" onClick={e => this.props.history.push("/transactions")} title="Transactions">
            <NavIcon>
              <i className="fa fa-fw fa-exchange-alt" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              <span className="nav-item__text">Transactions</span>
            </NavText>
          </NavItem>
          <NavItem eventKey="top" onClick={e => this.props.history.push("/top")} title="Top 100">
            <NavIcon>
              <i className="fa fa-fw fa-sort-amount-down" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              Top 100
          </NavText>
          </NavItem>
          <NavItem eventKey="validators" onClick={e => this.props.history.push("/validators")} title="Validators">
            <NavIcon>
              <i className="fa fa-fw fa-network-wired" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              <span className="nav-item__text">Validators</span>
            </NavText>
          </NavItem>
          <NavItem eventKey="movement" onClick={e => this.props.history.push("/movement")} title="Movement">
            <NavIcon>
              <i className="fa fa-fw fa-random" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              <span className="nav-item__text">Movement</span>
            </NavText>
          </NavItem>

          {/* <NavItem eventKey="proposals" onClick={e => this.props.history.push("/proposals")} title="Proposals">
            <NavIcon>
              <i className="fa fa-fw fa-edit" style={{ fontSize: '1.5em', color: 'black' }} />
            </NavIcon>
            <NavText>
              Proposals
              </NavText>
          </NavItem> */}
          {/*  <NavItem eventKey="fundingcycles" onClick={ e => this.props.history.push("/fundingcycles") } title="Funding Cycles">
                        <NavIcon>
                            <i className="fa fa-fw fa-bullseye" style={{ fontSize: '1.5em', color: 'black' }} />
                        </NavIcon>
                        <NavText>
                            Funding Cycles
                        </NavText>
                        
                    </NavItem>*/}
          {/*<NavItem eventKey="voting-power-distribution" onClick={ e => this.props.history.push("/voting-power-distribution") } title="Delegations">*/}
          {/*    <NavIcon>*/}
          {/*        <i className="fa fa-fw fa-chart-bar" style={{ fontSize: '1.5em', color: 'black'}} />*/}
          {/*    </NavIcon>*/}
          {/*    <NavText>*/}
          {/*        <span className="nav-item__text">Delegations</span>*/}
          {/*    </NavText>*/}
          {/*</NavItem>*/}
        </SideNav.Nav>
      </SideNav>
    )
  }
}
