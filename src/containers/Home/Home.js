import React, { Component } from "react";
import { Row, Col, Card, Icon, Carousel, Affix } from 'antd';
// import Center from 'react-center';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";
import { StickyContainer, Sticky } from 'react-sticky';

const bounceAnimation = keyframes`${bounceInUp}`;
// const slideInAnimation = keyframes`${slideInLeft}`;

const bgImg = require(`../../public/bg.jpg`);
const offerImg = require(`../../public/offer-min.jpg`);

const Background = styled(ProgressiveImage)`
  background-size: contain;
  background-position: right;
  background-color: lightgrey;
  height: 900px;
  @media only screen and (max-width: 480px) {
    height: 567px;
    background-size: cover;
    background-position: top;
    background-color: white;
  } 
`
const OfferCard = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  min-height: 150px;
`

const Template = ` 
  <div class="ant-col-xs-12 ant-col-sm-12">    
    <a href='{{link}}' target='_blank' class='instafeed__item'>
      <img class='instafeed__item__background' src='{{image}}' style="padding-right: 5px;"/>
    </a>
  </div>
`
const InstaCard = styled(Card)`
    
`

const InstaLoad = styled(Row)`
  animation: 2s ${bounceAnimation};
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerimage: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG',
      image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/bg-home.jpg',
      loaded: false
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {   
    return (       
      <Row>
        <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear">
          <Row>
            <Col xs={12}> 
              
              <Card title="Special Offer">
                <OfferCard src={this.state.offerimage} placeholder={offerImg} transition="all 1s linear" />
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
              <Card className="is-hidden-mobile" title="Наши новости" bordered="false">
                <Carousel effect="fade" autoplay autoplaySpeed={5000}>
                  <div><h3>1</h3></div>
                  <div><h3>2</h3></div>
                  <div><h3>3</h3></div>
                  <div><h3>4</h3></div>
                </Carousel>
              </Card>
            </Col>
          </Row>
        </Background>
        <Affix offsetBottom={0}>
          <Row style={{paddingBottom: "20px"}}>
            <Col className="is-hidden-tablet" xs={24}>
              <Card title="Наши новости" bordered="false">
                <Carousel effect="fade" autoplay autoplaySpeed={5000}>
                  <div><h3>1</h3></div>
                  <div><h3>2</h3></div>
                  <div><h3>3</h3></div>
                  <div><h3>4</h3></div>
                </Carousel>
              </Card>
            </Col>
          </Row>    
        </Affix>
      </Row> 
    );
  }
}