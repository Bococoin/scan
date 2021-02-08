import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { Row, Col, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Progress, Spinner } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
export default class DistributionChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
      options: {}
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.distribution != this.props.distribution){

      let distribution = this.props.distribution;

      this.setState({
        data:{
          labels:
            [
              "Top 1 - 25",
              "Top 26 - 50",
              "Top 51 - 75",
              "Top 76 - 100",
              "101+"
            ]
          ,
          datasets: [
            {
              data: [
                distribution.t_1_25.percent,
                distribution.t_26_50.percent,
                distribution.t_51_75.percent,
                distribution.t_76_100.percent,
                distribution.t_101plus.percent
              ],
              backgroundColor: [
                "#39005a", "#59006a", "#7a0177", "#9e017e", "#ae017e"
              ],
              hoverBackgroundColor: [
                "#39005a", "#59006a", "#7a0177", "#9e017e", "#ae017e"
              ]
            }
          ]
        },
        options:{
          maintainAspectRatio: false,
          elements: {
            arc: {
                borderWidth: 0
            }
          },
          segmentShowStroke: false,
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.labels[tooltipItem.index] || '';

                if (label) {
                  label += ' hold ';
                }
                label += numbro(data.datasets[0].data[tooltipItem.index]).format(window.config.numbers.withDecimal) + '%';
                label += " coins";
                return label;
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
      if (this.props.distrExist && this.props.distribution){
        return (
          <Card className="border-0 shadow-none bg-transparent">
            <div className="card-header"><T>accounts.distribution</T></div>
            <CardBody>
              <Pie width="100%" height="100%" data={this.state.data} options={this.state.options} />
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
