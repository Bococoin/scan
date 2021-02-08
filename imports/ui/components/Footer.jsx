import React from 'react';
import {
    Navbar,
    Nav,
    NavItem } from 'reactstrap';

import { NavLink } from 'react-router-dom';
import moment from 'moment';
import i18n from 'meteor/universe:i18n';
import {NavIcon, NavText} from "@trendmicro/react-sidenav";

const T = i18n.createComponent();

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar light expand="md" fixed="bottom" id="footer" className="d-md-flex footer-color">
                    <span className="text-muted">All rights reserved &copy;{moment().format('YYYY')}</span>
                    <Nav className="ml-auto" navbar>
                        <NavItem id="footer">
                            <NavLink to="/" className="white">Boco Coin</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Navbar color="light" light fixed="bottom" className="d-block d-md-none mobile-menu">
                    <Nav>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]===""?'is-active':null} to="/"><i className="fa fa-fw fa-home" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="blocks"?'is-active':null} to="/blocks"><i className="fa fa-fw fa-th" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="transactions"?'is-active':null} to="/transactions"><i className="fa fa-fw fa-exchange-alt" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="top"?'is-active':null} to="/top"><i className="fa fa-fw fa-sort-amount-down" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="validator" || window.location.pathname.split('/')[1]==="validators" || window.location.pathname.split('/')[1]==="account"?'is-active':null} to="/validators"><i className="fa fa-fw fa-network-wired" /></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={window.location.pathname.split('/')[1]==="movement"?'is-active':null} to="/movement"><i className="fa fa-fw fa-random" /></NavLink>
                        </NavItem>
                        {/*<NavItem>*/}
                        {/*    <NavLink className={window.location.pathname.split('/')[1]==="leagues" ?'is-active':null} to="/leagues"><i className="fa fa-fw fa-flag" /></NavLink>*/}
                        {/*</NavItem>*/}

                        {/*<NavItem>*/}
                        {/*    <NavLink className={window.location.pathname.split('/')[1]==="fundingcycles"?'is-active':null} to="/fundingcycles"><i className="fa fa-fw fa-bullseye" /></NavLink>*/}
                        {/*</NavItem>*/}
                        {/*<NavItem>*/}
                        {/*    <NavLink className={window.location.pathname.split('/')[1]==="voting-power-distribution"?'is-active':null} to="/voting-power-distribution"><i className="fa fa-fw fa-chart-bar" /></NavLink>*/}
                        {/*</NavItem>*/}
                    </Nav>
                </Navbar>
            </div>  
        );
    }
}