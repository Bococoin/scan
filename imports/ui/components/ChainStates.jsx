import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Row, Col } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class ChainStates extends Component{
    constructor(props){
        super(props);
        
        if (Meteor.isServer){
            let data = {}
            if (this.props.chainStates.communityPool){
                data.communityPool = this.props.chainStates.communityPool.map((pool,i) => {
                    return <span key={i}>{numbro(pool.amount/Meteor.settings.public.stakingFraction).format(window.config.numbers.decimalFormatWithSeparator)} {Meteor.settings.public.stakingDenom}</span>
                })
                // data.inflation = numbro(this.props.chainStates.inflation).format(window.config.numbers.percentWithDecimals)
                data.deflation = numbro(this.props.chainStates.deflation).format(window.config.numbers.percentWithDecimals)
                data.minting = <span>{numbro(this.props.chainStates.minting/Meteor.settings.public.stakingFraction).format(window.config.numbers.decimalFormatWithSeparator)} {Meteor.settings.public.stakingDenom}</span>
            }
    
            if (this.props.coinStats.usd){
                data.price = numbro(this.props.coinStats.usd).format(window.config.numbers.dollarFormat),
                data.marketCap = numbro(this.props.coinStats.usd_market_cap).format(window.config.numbers.dollarFormat)
            }    

            this.state = data;
        }
        else{
            this.state = {
                price: "$-",
                marketCap: "$-",
                // inflation: 0,
                deflation: 0,
                minting: 0,
                communityPool: 0
            }
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.chainStates != prevProps.chainStates){
            if (this.props.chainStates.communityPool){
                this.setState({
                    communityPool: this.props.chainStates.communityPool.map((pool,i) => {
                        return <span key={i}>{numbro(pool.amount/Meteor.settings.public.stakingFraction).format(window.config.numbers.decimalFormatWithSeparator)} {Meteor.settings.public.stakingDenom}</span>
                    }),
                    // inflation: numbro(this.props.chainStates.inflation).format(window.config.numbers.percentWithDecimals)
                    deflation: numbro(this.props.chainStates.deflation).format(window.config.numbers.percentWithDecimals),
                    minting: numbro(this.props.chainStates.minting/Meteor.settings.public.stakingFraction).format(window.config.numbers.minting) + Meteor.settings.public.stakingDenom
                })
            }
        }

        if (this.props.coinStats != prevProps.coinStats){
            if (this.props.coinStats.usd){
                this.setState({
                    price: numbro(this.props.coinStats.usd).format(window.config.numbers.dollarFormat),
                    marketCap: numbro(this.props.coinStats.usd_market_cap).format(window.config.numbers.dollarFormat)
                })
            }
        }
    }
    render(){
        return <Card className="d-lg-inline-block color">
            <CardHeader>
                <Row className="white">
                    {/* <Col xs={4} md="auto"><small><span><T>chainStates.price</T>:</span> <strong>{this.state.price}</strong></small></Col> */}
                    {/* <Col xs={8} md="auto"><small><span><T>chainStates.marketCap</T>:</span> <strong>{this.state.marketCap}</strong></small></Col> */}
                    {/* <Col xs={4} md="auto"><small><span><T>chainStates.inflation</T>:</span> <strong>{this.state.inflation}</strong></small></Col> */}
                    <Col xs={4} md="auto"><small><span><T>chainStates.minting</T>:</span> <strong>{this.state.minting}</strong>/block</small></Col>
                    {/* <Col xs={4} md="auto"><small><span><T>chainStates.deflation</T>:</span> <strong>{this.state.deflation}</strong></small></Col> */}
                    <Col xs={8} md="auto"><small><span><T>chainStates.communityPool</T>:</span> <strong>{this.state.communityPool}</strong></small></Col>
                </Row>
            </CardHeader>
        </Card>
    }
}
