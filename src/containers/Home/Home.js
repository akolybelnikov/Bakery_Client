import React, { Component } from "react";
import { Card, Carousel } from 'antd';
import "./Home.css";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from '../../components/Instafeed';

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

const Instacard = styled(Card)`
  animation: 2s ${bounceAnimation};
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerimage: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/offer.JPG',
      image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/bg-home.jpg'
    }
  }

  render() {   
    return (       
      <div className="tile is-ancestor">
        <div className="tile is-vertical is-8">
          <div className="tile is-parent">
            <article className="tile is-child box">
              <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer">
                <Instacard title="Мы на Instagram" bordered="false">                         
                    <Instafeed />  
                </Instacard>
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