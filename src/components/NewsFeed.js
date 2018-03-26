import React, { Component } from "react";
import config from "../config";
import { Row, Col, Card, Carousel, Spin, Icon, notification } from "antd";
import ProgressiveImage from "react-progressive-bg-image";
import { invokeOpenApi } from "../libs/awsLib";
import styled from "styled-components";
import Responsive from "react-responsive";
import localforage from "localforage";

const logoImg = require(`../public/logo.png`);

const NewsImage = styled(ProgressiveImage)`
  background-size: contain;
  background-position: center;
  min-width: 200px;
  min-height: 200px;
  @media only screen and (max-width: 480px) {
    min-width: 75px;
    min-height: 75px;
  }
  @media only screen and (min-width: 481px) and (max-width: 767px) {
    min-width: 125px;
    min-height: 125px;
  }
`;

const NewsCard = styled(Card)`
  p {
    font-size: 16px;
  }
`;

const CarouselCard = styled(Card)`
  .ant-card-head:hover {
    background: rgba(234, 204, 178, 0.5);
  }
  .ant-card-actions {
    background: rgba(234, 204, 178, 0.5);
    li {
      margin: 12px 0 0;
      span {
        i {
          margin-right: 5px;
        }
        a {
          color: rgba(234, 204, 178, 1);
          font-size: 18px;
          :hover {
            color: white;
          }
        }
      }
    }

    @media screen and (max-width: 480px) {
      .slick-list {
        height: 125px;
      }
    }

    @media screen and (min-width: 768px) {
      li > span a {
        font-size: 18px;
      }
      .slick-list {
        height: 250px;
      }
    }
  }
`;

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

export default class NewsFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    try {
      const news = await this.getNews();
      this.setState({
        news: news,
        isLoading: false
      });
    } catch (e) {
      this.openErrorNotification();
    }
  }

  async getNews() {
    const hours = 3600000;
    const timecheck = Date.now() - 12 * hours;
    try {
      const fingerprint = await localforage.getItem("newstimestamp");

      const stored = await localforage.getItem("news");
      if (stored && fingerprint && fingerprint.createdAt > timecheck) {
        return stored;
      } else {
        if (!fingerprint) {
          const timestamp = { createdAt: Date.now() };
          await localforage.setItem("newstimestamp", timestamp);
        }

        if (stored) {
          await localforage.removeItem("news");
        }

        const news = [];
        const results = await invokeOpenApi({ path: "/news" });
        await this.sortByDate(results).reverse();

        for (let i = 0; i < 5; i++) {
          if (results[i] !== undefined) {
            news.push(results[i]);
          }
        }

        await localforage.setItem("news", news);
        return news;
      }
    } catch (e) {
      this.openErrorNotification();
    }
  }

  openErrorNotification() {
    notification["error"]({
      message: "Произошла ошибка при загрузке!",
      description: "Пожалуйста, попробуйте загрузить приложение ещё раз."
    });
  }

  sortByDate(array) {
    return array.sort((a, b) => a.createdAt - b.createdAt);
  }

  renderNews(news) {
    return news.map(newsitem => (
      <a key={newsitem.newsId} href="/news">
        <Row style={{ marginRight: "20px" }}>
          <Col xs={6}>
            <Card
              bordered={false}
              cover={
                <NewsImage
                  src={`${config.s3.URL}/200x200/${newsitem.image}`}
                  placeholder={logoImg}
                  transition="all 1s linear"
                  crossOrigin="anonymous"
                />
              }
            />
          </Col>
          <Col xs={{ span: 16, offset: 2 }} sm={{ span: 17, offset: 1 }}>
            <NewsCard className="news-card" bordered={false}>
              <p className="news-text">
                <Mobile>{newsitem.content.substring(0, 200)} ... </Mobile>
                <Tablet>{newsitem.content.substring(0, 275)} ... </Tablet>
                <Desktop>{newsitem.content.substring(0, 350)} ... </Desktop>
              </p>
            </NewsCard>
          </Col>
        </Row>
      </a>
    ));
  }

  render() {
    return (
      <div
        style={{
          marginTop: "25px",
          marginBottom: "35px",
          background: "rgba(234,204,178,.5)",
          padding: ".7rem"
        }}
      >
        <CarouselCard
          style={{ cursor: "pointer" }}
          title="Наши новости"
          bordered="false"
          actions={[
            <a href="/news" className="news-button ant-btn ant-btn-primary">
              <Icon type="select" />Посмотреть все новости
            </a>
          ]}
        >
          <Carousel autoplaySpeed={10000} autoplay>
            {this.state.news ? (
              this.renderNews(this.state.news)
            ) : (
              <Spin style={{ display: "block" }} size="small" />
            )}
          </Carousel>
        </CarouselCard>
      </div>
    );
  }
}
