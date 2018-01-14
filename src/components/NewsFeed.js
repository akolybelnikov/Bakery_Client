import React, { Component } from "react";
import config from "../config";
import { Row, Col, Card, Carousel, Spin } from 'antd';
import ProgressiveImage from 'react-progressive-bg-image';
import { invokeOpenApi } from "../libs/awsLib";
import styled from 'styled-components';
import Responsive from 'react-responsive';

const logoImg = require(`../public/logo.png`);

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

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

export default class NewsFeed extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          news: [],
          isLoading: true
        }
    }

    async componentDidMount() {

        try {
    
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

    getNews() {
        return invokeOpenApi({ path: "/news"});
    }

    renderNews(news) {
        if (this.state.news) 
          return news.map(
            (newsitem) => 
              <a key={newsitem.newsId} href='/news'>
                <Row style={{marginRight: '20px'}}>  
                  <Col xs={6}><Card bordered={false} cover={<NewsImage src={`${config.s3.URL}/200x200/${newsitem.image}`} placeholder={logoImg} transition="all 1s linear" crossOrigin='anonymous'/>}></Card></Col>
                  <Col xs={{ span: 16, offset: 2 }} sm={{ span: 17, offset: 1 }}><Card className='news-card' bordered={false}><p className='is-size-7-mobile is-size-5-tablet news-text' style={{textAlign: "center"}}><Mobile>{newsitem.content.substring(0, 100)} ... </Mobile><Tablet>{newsitem.content.substring(0, 250)} ... </Tablet><Desktop>{newsitem.content.substring(0, 300)} ... </Desktop></p></Card></Col>
                </Row>
              </a>
        )
    }

    render() {
        return (
            <div style={{marginTop: "25px", marginBottom: "35px", background: "rgba(234,204,178,.5)", padding: ".7rem"}}>
                <Card style={{cursor: "pointer"}} title="Наши новости" bordered="false">            
                    <Carousel autoplaySpeed={5000} autoplay>
                        {this.state.news ? this.renderNews(this.state.news) : <Spin style={{display: 'block'}} size="small" />}
                    </Carousel>           
                </Card>
            </div> 
        )
    }

}