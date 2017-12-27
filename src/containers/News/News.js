import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, Icon, Spin } from 'antd';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';
import Responsive from 'react-responsive';
import { invokeOpenApi } from "../../libs/awsLib";
import config from "../../config";
import "./News.css";

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const bgImg = require(`../../public/logo-300.png`);

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const BreadCrumbs = styled(Row)`
    color: #331507;
    margin-top: 35px;
`;

const NewsRow = styled(Row)`
    margin: 7.5% 0;
`;

const NewsCard = styled.article`
    padding: 10px;
`;

const Image = styled(ProgressiveImage)`
    height: 500px;
    width: 500px;
    background-size: cover;
    background-position: center center;
    @media only screen and (min-width: 415px) and (max-width: 768px) {
        height: 300px;
        width: 300px;
    }
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
        return (
            <NewsCard key={news.newsId} className='media'>
                <figure className='media-left'>
                    <Mobile><Image crossOrigin='anonymous' src={`${config.s3.URL}/200x200/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Mobile>
                    <Tablet><Image crossOrigin='anonymous' src={`${config.s3.URL}/300x300/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Tablet>
                    <Desktop><Image crossOrigin='anonymous' src={`${config.s3.URL}/500x500/${news.image}`} placeholder={bgImg} transition="all 1s linear" /></Desktop>
                </figure>
                <div className='medi-content'>
                    <div className='content'>
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
                   <Col>
                        {this.state.news ? this.renderAllNews(this.state.news) : <Spin style={{display: 'block', margin: '15% 0 25% 0'}} size="large" />}
                   </Col>
                </NewsRow>
           </div>
        );
    }

}

