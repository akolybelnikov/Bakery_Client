import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, Icon, Spin } from 'antd';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';
import Responsive from 'react-responsive';
import { invokeOpenApi } from "../../libs/awsLib";
import config from "../../config";
import Time from 'react-time'
import "./News.css";

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={482} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={481} />;

const bgImg = require(`../../public/logo.png`);

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const BreadCrumbs = styled(Row)`
    color: #331507;
    margin-top: 35px;
    font-size: 18px;
`;

const NewsRow = styled(Row)`
    margin: 5% 0;
`;

const NewsCard = styled.article`
    padding: 10px;
`;

const Image = styled(ProgressiveImage)`
    height: 300px;
    width: 300px;
    background-size: cover;
    background-position: center center;
    @media only screen and (max-width: 414px) {
        height: 100px;
        width: 100px;
    }
`;

export default class News extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            news: [],
            isLoading: true
        }
    }

    async componentDidMount() {
      
        try {

          const results = await this.getNews();
          results.reverse();
          this.setState({ news: results });

        } catch (e) {
          console.log(e);
        }
      
        this.setState({ isLoading: false });
    }
    
    getNews() {
        return invokeOpenApi({ path: "/news"});
    }

    handleClick = event => {
        event.preventDefault();
        this.props.history.push('/');
    }

    renderNews(news) {
        let time = new Date(news.createdAt);
        return (
            <NewsCard key={news.newsId} className='media'>
                <figure className='media-left'>
                    <Mobile><Image crossOrigin='anonymous' src={`${config.s3.URL}/200x200/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Mobile>
                    <Tablet><Image crossOrigin='anonymous' src={`${config.s3.URL}/300x300/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Tablet>
                    <Desktop><Image crossOrigin='anonymous' src={`${config.s3.URL}/300x300/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Desktop>
                </figure>
                <div className='medi-content'>
                    <div className='content'>
                        <p className='has-text-weight-semibold is-size-5-desktop is-size-6-tablet is-size-7-mobile'><Time value={time} format='DD/MM/YYYY' /></p>
                        <p className='is-size-5-desktop is-size-6-tablet is-size-7-mobile'>{news.content}</p>
                    </div>
                </div>
            </NewsCard>
        );
    }

    renderAllNews(news) {
        return news.map(
            (item) => this.renderNews(item)
        );
    }

    render() {
        return (
           <div>
                <IconRow className="is-hidden-tablet"><Icon onClick={this.handleClick} className="icon-back" type="left" /></IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>Новости</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <NewsRow>
                   <Col style={{marginBottom: '15%'}}>
                        {this.state.news ? this.renderAllNews(this.state.news) : <Spin style={{display: 'block', margin: '15% 0 25% 0'}} size="large" />}
                   </Col>
                </NewsRow>
           </div>
        );
    }

}

