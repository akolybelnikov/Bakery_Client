import React, { Component } from "react";
import { Row, Card, Carousel } from 'antd';
// import Center from 'react-center';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";
// import { StickyContainer, Sticky } from 'react-sticky';

const bounceAnimation = keyframes`${bounceInUp}`;
// const slideInAnimation = keyframes`${slideInLeft}`;

const bgImg = require(`../../public/bg.jpg`);
const offerImg = require(`../../public/offer-min.jpg`);

const Background = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center center;
  background-color: lightgrey;
  height: 550px;
  @media only screen and (max-width: 480px) {
    height: 267px;
    background-size: cover;
    background-position: top;
    background-color: white;
  } 
  @media only screen and (max-width: 1024px) and (min-width: 480px) {
    height: 500px;
    background-size: cover;
    background-position: top;
    background-color: white;
  } 
`
const OfferCard = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  min-height: 200px;
`

const Template = ` 
  <div class="ant-col-xs-12 ant-col-sm-6">    
    <a href='{{link}}' target='_blank' class='instafeed__item'>
      <img class='instafeed__item__background' src='{{image}}' style="padding-right: 5px;"/>
    </a>
  </div>
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
      <div className="tile is-ancestor">
        <div className="tile is-vertical is-8">
          <div className="tile is-parent">
            <article className="tile is-child box">
              <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer">
                <Card title="Мы на Instagram" bordered="false">
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
                </Card>
              </a> 
            </article>
          </div>
          <div className="tile">
            <div className="tile is-parent">
              <article className="tile is-child box">
                <Card title="Спецпредложение">
                  <OfferCard src={this.state.offerimage} placeholder={offerImg} transition="all 1s linear" />
                </Card>
              </article>
            </div>

            <div className="tile is-parent">
              <article className="tile is-child box">
                <Card title="Наши новости" bordered="false">
                  <Carousel effect="fade" autoplaySpeed={5000}>
                    <div><img src='https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG'/></div>
                    <div><img src='https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG'/></div>
                    <div><img src='https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG'/></div>
                    <div><img src='https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG'/></div>
                  </Carousel>
                </Card>
              </article>
            </div>
          </div>       
        </div>

      
        <div className="tile is-parent is-hidden-mobile">
          <article className="tile is-child box">
            <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear" />  
          </article>
        </div>
      </div>
    );
  }
}