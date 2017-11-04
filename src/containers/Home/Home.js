import React, { Component } from "react";
import { Row, Col, Card, Button, Icon } from 'antd';
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
`

const InstaLoad = styled(Row)`
  animation: 2s ${bounceAnimation};
`

const ButtonCard = styled(Card)`
  margin-top: 20px;
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750',
      windowHeight: this.props.windowHeight
    }
  }

  onSuccess(object) {
    console.log(this.instafeed);
  }

  componentDidMount() {
    console.log(this.instafeed.props.children);
  }

  render() {   
    return (
      <Row>
        <Col sm={14}>
            <InstaCard title="Our news on Instagram" bordered="false">
              <InstaLoad type="flex" justify="start" ref={instafeed => this.instafeed = instafeed} id='instafeed'>              
                <Instafeed
                  limit='16 '
                  resolution='thumbnail'
                  sortBy='most-recent'
                  template={Template}
                  userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                  clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                  accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
                  success={this.onSuccess(Instafeed)}
                />  
              </InstaLoad>
            </InstaCard> 
            <ButtonCard>
              <Center><Button className="ProductButton has-text-white is-size-7-mobile is-size-6">
              <Icon type="caret-down" />Go to products<Icon type="caret-down" /></Button></Center>
            </ButtonCard>          
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