import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import { Row, Col, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Progress, Spinner } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
export default class ThirtyFour extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {},
            options: {}
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.stats != this.props.stats){
            let topPercent = this.props.stats.topTwentyPower/this.props.stats.totalVotingPower;
            let bottomPercent = this.props.stats.bottomEightyPower/this.props.stats.totalVotingPower;

            let self = this;
            this.setState({
                data:{
                    labels:
                        [
                            "No. of validators hold 34%+ VP",
                            "No. of validators hold rest of VP"
                        ]
                    ,
                    datasets: [
                        {
                            data: [
                                this.props.stats.numTopThirtyFour,
                                this.props.stats.numBottomSixtySix
                            ],
                            backgroundColor: [
                                '#b43db7',
                                '#59ccc8'
                            ],
                            hoverBackgroundColor: [
                                '#b43db7',
                                '#59ccc8'
                            ]
                        }
                    ]
                },
                options:{
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                // var label = data.datasets[0].data[tooltipItem.index] + " validators hold ";
                                // label += numbro(data.datasets[0].data[tooltipItem.index]).format(window.config.numbers.percentWithDecimals);
                                if (tooltipItem.index == 0)
                                    return data.datasets[0].data[tooltipItem.index] + " validators hold "+numbro(self.props.stats.topThirtyFourPercent).format(window.config.numbers.percentWithDecimals)+" voting power";
                                else 
                                    return data.datasets[0].data[tooltipItem.index] + " validators hold "+numbro(self.props.stats.bottomSixtySixPercent).format(window.config.numbers.percentWithDecimals)+" voting power";
                            }
                        }
                    }
                }
            });
        }
    }

    render(){
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            if (this.props.statsExist && this.props.stats){
                return (                    
                    <Card>
                        <div className="card-header backgroundcolor"><T>votingPower.minValidators34</T></div>
                        <CardBody>
                            <Doughnut data={this.state.data} options={this.state.options} />
                        </CardBody>
                    </Card>
                );   
            }
            else{
                return <div></div>
            }
        }
    }
}    
