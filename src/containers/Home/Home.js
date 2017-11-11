import React, { Component } from "react";
import { Row, Col, Card, Icon } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp, slideInLeft } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";

const bounceAnimation = keyframes`${bounceInUp}`;
const slideInAnimation = keyframes`${slideInLeft}`;

const bgImg = require(`./bg.jpg`);

const Background = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center center;
  min-height: 710px;
`;

const Template = ` 
  <div class="ant-col-xs-3 ant-col-sm-6">    
    <a href='{{link}}' target='_blank' class='instafeed__item'>
      <img class='instafeed__item__background' src='{{image}}' style="padding-right: 5px;"/>
    </a>
  </div>
`
const InstaCard = styled(Card)`
  :hover {
    background: #feeff5;
  };
`

const InstaLoad = styled(Row)`
  animation: 2s ${bounceAnimation};
`

const GoButton = styled(Card)`
  cursor: pointer;
  animation: 1s ${slideInAnimation};
  :hover {
    background: #feeff5;
  };
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750',
      loaded: false
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {   
    return (        
      <Row>
        <Col sm={14}>
            <InstaCard title="Наши новинки на Instagram" bordered="false">
              <InstaLoad type="flex" justify="start" id='instafeed'>              
                <Instafeed ref={instafeed => this.instafeed = instafeed}
                  limit='16'
                  resolution='thumbnail'
                  sortBy='most-recent'
                  template={Template}
                  userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                  clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                  accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
                />  
              </InstaLoad>
            </InstaCard>
            <GoButton>
              <a href="/products">
                <Center>
                  <p><span className="ant-card-head-title">Наш ассортимент<Icon type="right" /></span></p>
                </Center>
              </a>
            </GoButton>          
        </Col> 
        <Col sm={10}>
          <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear">
          </Background>
        </Col> 
      </Row>       
    );
  }
}