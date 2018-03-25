import React, { Component } from "react";
import { Card, Modal, Row, Col } from "antd";
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import styled, { keyframes } from "styled-components";
import { zoomIn } from "react-animations";
import ProgressiveImage from "react-progressive-bg-image";
import Instafeed from "../../components/Instafeed";
import NewsFeed from "../../components/NewsFeed";
import Responsive from 'react-responsive';
import LazyLoad from 'react-lazyload';
import "./Home.css";
import tinyBread from '../../public/tiny_bread.png';
import bread from '../../public/bread.png';
import tinyCoffee from '../../public/tiny_coffee.png';
import coffee from '../../public/coffee.png';
import tinyCakes from '../../public/tiny_cakes.png';
import cakes from '../../public/cakes.png';
import tinyOrder from '../../public/tiny_order.png';
import order from '../../public/order.png';

const zoomInAnimation = keyframes`${zoomIn}`;

const bgImg = require(`../../public/bg.jpg`);
const logoImg = require(`../../public/logo.png`);

const Desktop = props => <Responsive {...props} minWidth={769} />;
const Tablet = props => <Responsive {...props} minWidth={416} maxWidth={768} />;
const Mobile = props => <Responsive {...props} maxWidth={415} />;

const ImageCard = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  height: 450px;
`
const OfferCard = styled(ProgressiveImage)`
  background-size: contain;
  background-position: center;
  min-height: 200px;
  @media only screen and (min-width: 480px) and (max-width: 768px) {
    min-height: 345px;
  }
`

const ModalImage = styled(ProgressiveImage)`
  background-size: contain;
  background-position: center center;
  height: 500px;
  width: 500px;
  max-width: 100%;
  @media only screen and (max-width: 389px) {
    width: 300px;
    height: 300px;
    background-position: top;
  }
  @media only screen and (min-width: 480px) and (max-width: 768px) {
    width: 750px;
    height: 750px;
    background-position: center center;
  }
`

const RowCard = styled(Card)`
  .ant-card-head-title {
    padding: 0;
  }
  .ant-card-head { 
    padding 10px 0;
  }
`;

const CategoryCard = styled(Col)`
  animation: 1.5s ${zoomInAnimation};
  cursor: pointer;
  .ant-card-head-title {
    padding: 0;
  }
  .ant-card-head { 
    padding 10px 0;
  }
`;

const CategoryImage = styled(ProgressiveImage)`
  min-height: 125px;
  background-size: cover;
  background-position: center center;
  @media only screen and (max-width: 767px) {
    min-height: 135px;
  }
`;

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerimage: '',
      offercontent: '',
      news: [],
      modalVisible: false,
      categories: [
        {
          categoryId: "1",
          categoryName: "bread",
          image: "bread_new.jpg",
          title: "Хлеб и булки"
        },
        {
          categoryId: "2",
          categoryName: "coffee",
          image: "coffee_new.jpg",
          title: "Кофе и другие напитки"
        },
        {
          categoryId: "3",
          categoryName: "cakes",
          image: "cakes_new.jpg",
          title: "Кондитерские изделия"
        },
        {
          categoryId: "4",
          categoryName: "order",
          image: "order_new.jpg",
          title: "Торты на заказ"
        }
      ],
      isLoading: true,
      instafeed: false
    }
  }

  async componentDidMount() {

    try {

      const offers = await this.getOffer();
      const sorted = this.sortByDate(offers).reverse();
      const offer = sorted[0];

      this.setState({ 
        offerimage: offer.image,
        offercontent: offer.content
       });

    } catch (e) {
      console.log(e);
    }
  }

  sortByDate(array) {
    return array.sort((a, b) => a.createdAt - b.createdAt);
  }

  renderCategories(categories) {
    return categories.map(
      (category) =>
        <CategoryCard key={category.categoryId} href={`/products/${category.categoryName}`} onClick={this.handleCategoryClick} xs={12} sm={6}>
          <Card hoverable id="category-card" title={category.categoryId === "1" ? "Хлеб" : category.categoryId === "2" ? "Кофе" : category.categoryId === "3" ? "Кондитерка" : "На заказ"}>
            <CategoryImage crossOrigin='anonymous'
              placeholder={category.categoryName === 'bread' ? tinyBread : category.categoryName === 'coffee' ? tinyCoffee : category.categoryName === 'cakes' ? tinyCakes : tinyOrder} 
              src={category.categoryName === 'bread' ? bread : category.categoryName === 'coffee' ? coffee : category.categoryName === 'cakes' ? cakes : order} transition="all 1.5s linear" />
          </Card>
        </CategoryCard>
    )
  }

  handleCategoryClick = event => {
      event.preventDefault();
      this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  getOffer() {
      return invokeOpenApi({ path: "/offers"});
  }

  renderOffer() {
    if (this.state.offercontent && this.state.offerimage) 
      return <OfferCard src={`${config.s3.URL}/350x350/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear" crossOrigin='anonymous' />;
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  openInstafeed = () => {
    this.setState({
      instafeed: true
    })
  }

  render() {   
    return (       
      <div id="root-div">
        <Desktop>
          <div className="tile is-ancestor">
            <div className="tile is-parent">
              <div className="tile is-parent is-8">              
                <RowCard title="Наш ассортимент" className="tile is-child box">
                    <Row>{this.state.categories && this.renderCategories(this.state.categories)}</Row>
                </RowCard>        
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <a onClick={() => {this.setModalVisible(true)}}>
                    <Card title="Спецпредложение">
                      {this.renderOffer()}
                    </Card>
                  </a>
                </div>
              </div>
            </div>
            <Modal 
                title={this.state.offercontent && this.state.offercontent} 
                wrapClassName="vertical-center-modal" 
                visible={this.state.modalVisible}  
                onOk={() => this.setModalVisible(false)} 
                onCancel={() => this.setModalVisible(false)}> 
                <ModalImage crossOrigin='anonymous' src={`${config.s3.URL}/500x500/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear" id="offer-modal" />  
            </Modal>
          </div>
          <div className="tile is-ancestor">      
              <div className="tile is-parent is-3">
                <article className="tile is-child is-box">
                  <LazyLoad once height={200}>
                    <ImageCard src={`${config.s3.URL}/300x450/photo-1498049281100-cb3c002220f5.jpg`} placeholder={bgImg} transition="all 1s linear" /> 
                  </LazyLoad> 
                </article>
              </div>     
            <Instafeed /> 
          </div>       
          <NewsFeed />
        </Desktop> 
        <Tablet>
          <div className="tile is-ancestor">
            <div className="tile is-parent">          
              <RowCard title="Наш ассортимент" className="tile is-child box">
                  <Row>{this.state.categories && this.renderCategories(this.state.categories)}</Row>
              </RowCard>        
            </div> 
            <div className="tile is-parent">
              <Row>
                <Col xs={8}>
                  <div id="unsplash">
                    <LazyLoad once height={200}>
                      <ImageCard src={`${config.s3.URL}/300x450/photo-1498049281100-cb3c002220f5.jpg`} placeholder={bgImg} transition="all 1s linear" /> 
                    </LazyLoad> 
                  </div>  
                </Col>
                <Col xs={16}>
                  <div className="box">
                    <a onClick={() => {this.setModalVisible(true)}}>
                      <Card title="Спецпредложение">
                        {this.renderOffer()}
                      </Card>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
            <Modal 
                title={this.state.offercontent && this.state.offercontent} 
                wrapClassName="vertical-center-modal" 
                visible={this.state.modalVisible}  
                onOk={() => this.setModalVisible(false)} 
                onCancel={() => this.setModalVisible(false)}> 
                <ModalImage crossOrigin='anonymous' src={`${config.s3.URL}/700x700/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear" id="offer-modal" />  
            </Modal>
            <div className="tile is-parent">
              <div className="tile is-child">
                <Instafeed />
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                <NewsFeed />
              </div>
            </div>
          </div>
        </Tablet>
        <Mobile>
          <div className="tile is-ancestor">
            <div className="tile is-parent">
              <div className="tile is-parent is-8">              
                <RowCard title="Наш ассортимент" className="tile is-child box">
                    <Row>{this.state.categories && this.renderCategories(this.state.categories)}</Row>
                </RowCard>        
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <a onClick={() => {this.setModalVisible(true)}}>
                    <Card title="Спецпредложение">
                      {this.renderOffer()}
                    </Card>
                  </a>
                </div>
              </div>
            </div>
            <Modal 
                title={this.state.offercontent && this.state.offercontent} 
                wrapClassName="vertical-center-modal" 
                visible={this.state.modalVisible}  
                onOk={() => this.setModalVisible(false)} 
                onCancel={() => this.setModalVisible(false)}> 
                <ModalImage crossOrigin='anonymous' src={`${config.s3.URL}/300x300/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear" id="offer-modal" />  
            </Modal>
          </div>
          <div className="tile is-ancestor">      
            <div className="tile is-parent">
              <div className="tile is-child">
                <Instafeed />
              </div>
            </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                <NewsFeed />
              </div>
            </div>
          </div>       
        </Mobile>
        <Row style={{marginBottom: 45, background: 'rgba(234,204,178,.5)', padding: '10px', textAlign: 'center'}}>
          <p className="has-text-weight-semibold">Наши часы работы:</p>
          <p>с понедельника по субботу: с 8.00 до 20.00 часов;</p>
          <p>в воскресенье: с 9.00 до 18.00 часов.</p>
        </Row>
      </div>
    );
  }
}