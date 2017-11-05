import React, { Component } from "react";
import { Row, Col, Card } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";

const bounceAnimation = keyframes`${bounceInUp}`;

const bgImg = require(`./bg.jpg`);

const Background = styled(ProgressiveImage).attrs({
  height: props => props.height
})`
  background-color: pink;
  background-size: cover;
  background-position: center center;
  min-height: ${props => props.height}px;
`;

const Template = ` 
  <div class="ant-col-xs-3 ant-col-sm-6">    
    <a href='{{link}}' target='_blank' class='instafeed__item'>
      <img class='instafeed__item__background' src='{{image}}' style="padding-right: 5px;"/>
    </a>
  </div>
`
const InstaCard = styled(Card)`
  color: white;
  margin-right: 10px;
`

const InstaLoad = styled(Row)`
  animation: 2s ${bounceAnimation};
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750',
      windowHeight: this.props.windowHeight
    }
  }

  beforeLoad() {
    console.log('going to fetch');
  }

  afterLoad() {
    console.log('loaded');
  }

  onSuccess() {
    console.log('success!');
    //this.setState({loaded: true});
  }

  componentDidMount() {
    //console.log(this.state.loaded);
  }

  componentWillUnmount() {
    console.log('unmounting');
  }

  render() {   
    return (
      <Row>
        <Col sm={14}>
            <InstaCard title="Our news on Instagram" bordered="false">
              <InstaLoad type="flex" justify="start" id='instafeed'>              
                <Instafeed ref={instafeed => this.instafeed = instafeed}
                  limit='20'
                  resolution='thumbnail'
                  sortBy='most-recent'
                  template={Template}
                  userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                  clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                  accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
                  before={this.beforeLoad()}
                  after={this.afterLoad()}
                  success={this.onSuccess()}
                />  
              </InstaLoad>
            </InstaCard>          
        </Col>
        <Col sm={10}>  
            <Card>
              <Background height={this.state.windowHeight} src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></Background>
            </Card>
        </Col>
      </Row>
    );
  }
}