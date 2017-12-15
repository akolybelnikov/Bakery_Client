import React, { Component } from "react";
import { Card, Modal, Row, Col, Carousel, Divider } from "antd";
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import styled, { keyframes } from "styled-components";
import { bounceInUp, bounceIn } from "react-animations";
import ProgressiveImage from "react-progressive-bg-image";
import Instafeed from "../../components/Instafeed";
import Center from "react-center";
import "./Home.css";

const bounceAnimation = keyframes`${bounceInUp}`;
const bounceInAnimation = keyframes`${bounceIn}`;

const bgImg = require(`../../public/bg.jpg`);
const offerImg = require(`../../public/offer-min.jpg`);

const Background = styled(ProgressiveImage)`
  background-size: cover;
  background-position: center center;
  background-color: lightgrey;
  height: 550px;
  @media only screen and (max-width: 480px) {
    height: 267px;
    background-position: top;
    background-color: white;
  } 
  @media only screen and (max-width: 1024px) and (min-width: 480px) {
    height: 500px;
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
  min-width: 200px;
  min-height: 200px;
  @media only screen and (max-width: 480px) {
    min-width: 65px;
    min-height: 65px;
    background-position: top;
  }
`
const CategoryCard = styled(Col)`
  animation: 1.5s ${bounceInAnimation};
  cursor: pointer;
`;
const CategoryImage = styled(ProgressiveImage)`
  min-height: 125px;
  background-size: cover;
  background-position: center center;
  @media only screen and (max-width: 767px) {
    min-height: 65px;
  }
`;

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      offerimage: '',
      offercontent: '',
      news: [],
      image: `${config.s3.UPLOADS_BUCKET_URL}/bg-home.jpg`,
      modalVisible: false,
      categories: []
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

      const news = [];
      const fetchedNews = await this.getNews();
      fetchedNews.reverse();
      for (let i = 0; i < 5; i++) {
        if (fetchedNews[i] !== undefined) {
          news.push(fetchedNews[i]);
        }
      }
      this.setState({ 
        news: news
      });

      const categories  = await this.getCategories();
      this.setState({
        categories: categories
      })
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
        <CategoryCard key={category.categoryId} href={`/products/${category.categoryName}`} onClick={this.handleCategoryClick} xs={6}>
          <Card id="category" title={category.categoryId == 1 ? "Хлеб" : category.categoryId == 2 ? "Кофе" : category.categoryId == 3 ? "Выпечка" : "Торты"}>
            <CategoryImage 
              placeholder={bgImg} 
              src={`${config.s3.URL}/250x250/${category.attachment.split('/')[4]}`} transition="all 1s linear" />
          </Card>
        </CategoryCard>
    )
  }

  handleCategoryClick = event => {
      event.preventDefault();
      this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  getOffers() {
      return invokeOpenApi({ path: "/offers"});
  }

  getNews() {
      return invokeOpenApi({ path: "/news"});
  }

  renderNews(news) {
    if (this.state.news) 
      return news.map(
        (newsitem) => 
          <article className="media" key={newsitem.newsId}>  
            <NewsImage className="media-left" src={`${config.s3.URL}/250x250/${newsitem.image}`} placeholder={offerImg} transition="all 1s linear"/>
            <div className="media-content"><div className="content">{newsitem.content}</div></div>
          </article>
      )
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  render() {   
    return (       
      <div>
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
                    <OfferCard src={`${config.s3.URL}/250x250/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear" />
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
              <Center>
                <ModalImage src={`${config.s3.URL}/500x500/${this.state.offerimage}`} placeholder={offerImg} transition="all 1s linear"  />
              </Center>   
          </Modal>
        </div>
        <div className="tile is-ancestor">
          <div className="tile is-parent is-4 is-hidden-mobile">
            <article className="tile is-child box">
              <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear" />  
            </article>
          </div>
          <div className="tile is-vertical is-parent">
            <article className="tile is-child box">
              <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer">
                <Instacard title="Мы на Instagram" bordered="false">                         
                    <Instafeed />  
                </Instacard>
              </a> 
            </article>
            <div className="tile is-child box">
              <Card title="Наши новости" bordered="false">            
                {this.renderNews(this.state.news) }           
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}