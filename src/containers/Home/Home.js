import React, { Component } from "react";
import { Row, Col, Card, Icon, Carousel, Affix } from 'antd';
// import Center from 'react-center';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";

const bounceAnimation = keyframes`${bounceInUp}`;
// const slideInAnimation = keyframes`${slideInLeft}`;

const bgImg = require(`./bg.jpg`);

const Background = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center center;
  min-height: 700px;
  position: relative;
  @media only screen and (max-width: 480px) {
    min-height: 355px;
    background-size: cover;
    background-position: top;
  } 
`;

const Template = ` 
  <div class="ant-col-xs-6 ant-col-sm-12">    
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

// const GoButton = styled(Card)`
//   cursor: pointer;
//   animation: 1s ${slideInAnimation};
// `

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
        <Col sm={12}>
        <Card title="Наши новости">
          <Carousel effect="fade" autoplay autoplaySpeed={5000}>
            <div><h3>1</h3></div>
            <div><h3>2</h3></div>
            <div><h3>3</h3></div>
            <div><h3>4</h3></div>
          </Carousel>
        </Card>       
        <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer">
          <InstaCard title="Мы на Instagram" bordered="false">
            <InstaLoad type="flex" justify="start" id='instafeed'>              
              <Instafeed
                limit='4'
                resolution='low_resolution'
                sortBy='most-recent'
                template={Template}
                userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
              />  
            </InstaLoad>
          </InstaCard>
        </a> 
        </Col>
        <Col sm={12}>
          <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear"></Background>
        </Col> 
        <Affix className="is-hidden-tablet" offsetBottom={40}>
          <a href="/products" className="button is-primary">
            <span> Наш ассортимент<Icon type="right" /></span>
          </a>
        </Affix>
      </Row>       
    );
  }
}