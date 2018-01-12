import React, { Component } from "react";
import { Card, Modal, Row, Col, Carousel, Spin } from "antd";
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import styled, { keyframes } from "styled-components";
import { zoomIn } from "react-animations";
import ProgressiveImage from "react-progressive-bg-image";
import Instafeed from "../../components/Instafeed";
import Responsive from 'react-responsive';
import LazyLoad from 'react-lazyload';
import "./Home.css";

const zoomInAnimation = keyframes`${zoomIn}`;

const bgImg = require(`../../public/bg.jpg`);
const bread = require(`../../public/categories/bread.jpg`);
const coffee = require(`../../public/categories/coffee.jpg`);
const cakes = require(`../../public/categories/cakes.jpg`);
const order = require(`../../public/categories/order.jpg`);
const offerImg = require(`../../public/logo.png`);

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
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

const Instacard = styled(Card)`
  animation: 2s ${zoomInAnimation};
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

const NewsImage = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center;
  min-width: 180px;
  min-height: 180px;
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    min-width: 150px;
    min-height: 150px;
  }
  @media only screen and (max-width: 480px) {
    min-width: 75px;
    min-height: 75px;
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

      const news = [];
      const fetchedNews = await this.getNews();
      fetchedNews.reverse();
      for (let i = 0; i < 5; i++) {
        if (fetchedNews[i] !== undefined) {
          news.push(fetchedNews[i]);
        }
      }
      this.setState({ 
        news: news,
        isLoading: false
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
      return <OfferCard src={`${config.s3.URL}/250x250/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear" crossOrigin='anonymous' />;
  }

  getNews() {
      return invokeOpenApi({ path: "/news"});
  }

  renderNews(news) {
    if (this.state.news) 
      return news.map(
        (newsitem) => 
          <a key={newsitem.newsId} href='/news'>
            <Row style={{marginRight: '20px'}}>  
              <Col xs={6}><Card bordered={false} cover={<NewsImage src={`${config.s3.URL}/200x200/${newsitem.image}`} placeholder={offerImg} transition="all 1s linear" crossOrigin='anonymous'/>}></Card></Col>
              <Col xs={{ span: 16, offset: 2 }} sm={{ span: 17, offset: 1 }}><Card className='news-card' bordered={false}><p className='is-size-7-mobile is-size-5-tablet news-text' style={{textAlign: "center"}}><Mobile>{newsitem.content.substring(0, 100)} ... </Mobile><Tablet>{newsitem.content.substring(0, 250)} ... </Tablet><Desktop>{newsitem.content.substring(0, 300)} ... </Desktop></p></Card></Col>
            </Row>
          </a>
      )
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
              <ModalImage crossOrigin='anonymous' src={`${config.s3.URL}/500x500/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear"  />  
          </Modal>
        </div>
        <div className="tile is-ancestor">
          <div className="tile is-parent is-3 is-hidden-mobile">
            <article className="tile is-child box">
              <LazyLoad once height={200}>
                <ImageCard src={`${config.s3.URL}/300x450/photo-1498049281100-cb3c002220f5.jpg`} placeholder={bgImg} transition="all 1s linear" /> 
              </LazyLoad> 
            </article>
          </div>
          <div className="tile is-vertical is-parent">
          <LazyLoad once height={200}>
            <article className="tile is-child box">              
              <Instacard title="Мы на Instagram" bordered="true">                         
                <Instafeed />
              </Instacard>   
            </article>
            </LazyLoad> 
          </div>
        </div>
        <div style={{marginTop: "25px", marginBottom: "35px", background: "rgba(234,204,178,.5)", padding: ".7rem"}}>
            <Card style={{cursor: "pointer"}} title="Наши новости" bordered="false">            
              <Carousel autoplaySpeed={5000} autoplay>
                {this.state.news ? this.renderNews(this.state.news) : <Spin style={{display: 'block'}} size="small" />}
              </Carousel>           
            </Card>
        </div>
      </div>
    );
  }
}