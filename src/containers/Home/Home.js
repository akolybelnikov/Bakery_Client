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

const zoomInAnimation = keyframes`${zoomIn}`;

const bgImg = require(`../../public/bg.jpg`);
const bread = require(`../../public/categories/bread.jpg`);
const coffee = require(`../../public/categories/coffee.jpg`);
const cakes = require(`../../public/categories/cakes.jpg`);
const order = require(`../../public/categories/order.jpg`);
const logoImg = require(`../../public/logo.png`);

const Tablet = props => <Responsive {...props} minWidth={481} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const ImageCard = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  height: 450px;
`
const OfferCard = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  min-height: 200px;
`

const ModalImage = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  height: 500px;
  width: 500px;
  @media only screen and (max-width: 480px) {
    width: 300px;
    height: 300px;
    background-position: top;
  }
`

const CategoryCard = styled(Col)`
  animation: 1.5s ${zoomInAnimation};
  cursor: pointer;
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
      categories: [],
      isLoading: true
    }
  }

  async componentDidMount() {

    try {

      const result = await this.getOffer();
      const offer = result[result.length - 1];

      const categories  = await this.getCategories();
      this.setState({
        categories: categories
      });

      this.setState({ 
        offerimage: offer.image,
        offercontent: offer.content
       });

    } catch (e) {
      console.log(e);
    }
  }

  getCategories() {
    return invokeOpenApi({ path: "/categories"});
  }

  renderCategories(categories) {
    return categories.map(
      (category) =>
        <CategoryCard key={category.categoryId} href={`/products/${category.categoryName}`} onClick={this.handleCategoryClick} xs={12} sm={6}>
          <Card hoverable id="category-card" title={category.categoryId === "1" ? "Хлеб" : category.categoryId === "2" ? "Кофе" : category.categoryId === "3" ? "Выпечка" : "Торты"}>
            <CategoryImage crossOrigin='anonymous'
              placeholder={category.categoryName === 'bread' ? bread : category.categoryName === 'coffee' ? coffee : category.categoryName === 'cakes' ? cakes : order} 
              src={`${config.s3.URL}/250x250/${category.image}`} transition="all 1s linear" />
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
      return <OfferCard src={`${config.s3.URL}/250x250/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear" crossOrigin='anonymous' />;
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  render() {   
    return (       
      <div id="root-div">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-parent is-8">              
               <Card title="Наш ассортимент" className="tile is-child box">
                  <Row>{this.state.categories && this.renderCategories(this.state.categories)}</Row>
               </Card>        
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
              <ModalImage crossOrigin='anonymous' src={`${config.s3.URL}/500x500/${this.state.offerimage}`} placeholder={logoImg} transition="all 1s linear"  />  
          </Modal>
        </div>
        <Tablet>
          <div className="tile is-ancestor">
            <div className="tile is-parent is-3 is-hidden-mobile">
              <article className="tile is-child box">
                <LazyLoad once height={200}>
                  <ImageCard src={`${config.s3.URL}/300x450/photo-1498049281100-cb3c002220f5.jpg`} placeholder={bgImg} transition="all 1s linear" /> 
                </LazyLoad> 
              </article>
            </div>      
            <Instafeed /> 
          </div>       
          <NewsFeed />
        </Tablet>
      </div>
    );
  }
}