import React, { Component } from "react";
import { Card, Carousel, Modal } from 'antd';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from '../../components/Instafeed';
import Center from 'react-center';
import "./Home.css";

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

const ModalImage = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  height: 500px;
  @media only screen and (max-width: 480px) {
    width: 300px;
    height: 300px;
    background-size: cover;
    background-position: top;
  }
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerimage: '',
      offercontent: '',
      image: `${config.s3.UPLOADS_BUCKET_URL}/bg-home.jpg`,
      modalVisible: false
    }
  }

  async componentDidMount() {

    try {
      const offers = await this.getOffers();
      const offer = offers[offers.length - 1];
      this.setState({ 
        offerimage: offer.image,
        offercontent: offer.content
       });
    } catch (e) {
      console.log(e);
    }
  }

  getOffers() {
      return invokeOpenApi({ path: "/offers"});
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
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
                <a onClick={() => {this.setModalVisible(true)}}>
                  <Card title="Спецпредложение">
                    <OfferCard src={`${config.s3.URL}/250x250/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear" />
                  </Card>
                </a>
              </article>
            </div>

            <Modal 
                title={this.state.offercontent && this.state.offercontent} 
                wrapClassName="vertical-center-modal" 
                visible={this.state.modalVisible}  
                onOk={() => this.setModalVisible(false)} 
                onCancel={() => this.setModalVisible(false)}> 
                <Center>
                  <ModalImage src={`${config.s3.URL}/500x500/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear"  />
                </Center>   
            </Modal>

            <div className="tile is-parent">
              <article className="tile is-child box">
                <Card title="Наши новости" bordered="false">
                  <Carousel effect="fade" autoplaySpeed={5000}>
                    <div><img alt="" src={`${config.s3.UPLOADS_BUCKET_URL}/offer.JPG`}/></div>
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