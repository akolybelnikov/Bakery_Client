import React, { Component } from "react";
import { Card, Modal, Row, Col, notification, Icon } from "antd";
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import styled, { keyframes } from "styled-components";
import { zoomIn } from "react-animations";
import ProgressiveImage from "react-progressive-bg-image";
import Instafeed from "../../components/Instafeed";
import NewsFeed from "../../components/NewsFeed";
import Responsive from "react-responsive";
import "./Home.css";
import tinyBread from "../../public/tiny_bread.png";
import tinyCoffee from "../../public/tiny_coffee.png";
import tinyCakes from "../../public/tiny_cakes.png";
import tinyOrder from "../../public/tiny_order.png";
import localforage from "localforage";
import LazyLoad from "react-lazy-load";

const zoomInAnimation = keyframes`${zoomIn}`;
const logoImg = require(`../../public/logo.png`);

const { Meta } = Card;

const Desktop = props => <Responsive {...props} minWidth={769} />;
const Tablet = props => <Responsive {...props} minWidth={416} maxWidth={768} />;
const Mobile = props => <Responsive {...props} maxWidth={415} />;

const OfferCard = styled(ProgressiveImage)`
  background-size: contain;
  background-position: center;
  min-height: 200px;
  @media only screen and (min-width: 480px) and (max-width: 768px) {
    min-height: 345px;
  }
`;

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
`;

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

const OfferDesktopCard = styled(Card)`
  .anticon.anticon-select {
    margin-right: 5px;
  }
`;

const TabletOfferCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  .ant-card-meta {
    padding: 10px;
  }
  .ant-card-meta-title {
    text-align: center;
    font-size: 1.5rem;
    color: rgba(82, 8, 45, 1);
  }
  .ant-card-meta-description {
    font-size: 1.2rem;
    font-weight: 600;
    overflow: hidden;
    white-space: normal;
  }
  @media screen and (max-width: 667px) {
    .ant-card-meta-description {
      font-size: 1.rem;
    }
    .ant-card-meta-title {
      font-size: 1.2rem;
    }
  }
`;

const MobileOfferCard = styled(Card)`
  .ant-btn {
    color: rgba(82, 8, 45, 1);
    border-color: rgba(82, 8, 45, 1);
  }
`

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offerimage: "",
      offercontent: "",
      news: [],
      modalVisible: false,
      categories: [
        {
          categoryId: "1",
          categoryName: "bread",
          title: "Хлеб и булки"
        },
        {
          categoryId: "2",
          categoryName: "coffee",
          title: "Кофе и другие напитки"
        },
        {
          categoryId: "3",
          categoryName: "cakes",
          title: "Кондитерские изделия"
        },
        {
          categoryId: "4",
          categoryName: "order",
          title: "Торты на заказ"
        }
      ],
      isLoading: true,
      instafeed: false
    };
  }

  async componentDidMount() {
    try {
      const offer = await this.getOffer();

      this.setState({
        offerimage: offer.image,
        offercontent: offer.content
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getOffer() {
    const hours = 3600000;
    const timecheck = Date.now() - 24 * hours;
    try {
      const fingerprint = await localforage.getItem("offertimestamp");

      const offer = await localforage.getItem("offer");
      if (offer && fingerprint && fingerprint.createdAt > timecheck) {
        return offer;
      } else {
        if (!fingerprint) {
          const timestamp = { createdAt: Date.now() };
          await localforage.setItem("offertimestamp", timestamp);
        }

        if (offer) {
          await localforage.removeItem("offer");
        }

        const offers = await invokeOpenApi({ path: "/offers" });
        const sorted = this.sortByDate(offers).reverse();
        const newOffer = sorted[0];
        await localforage.setItem("offer", newOffer);
        return newOffer;
      }
    } catch (e) {
      this.openWarningNotification();
    }
  }

  openWarningNotification() {
    notification["warning"]({
      message:
        "Произошла ошибка при загрузке! Возможно нет связи с интернетом.",
      description: "Пожалуйста, попробуйте загрузить приложение позже."
    });
  }

  sortByDate(array) {
    return array.sort((a, b) => a.createdAt - b.createdAt);
  }

  renderCategories(categories) {
    return categories.map(category => (
      <CategoryCard
        key={category.categoryId}
        href={`/products/${category.categoryName}`}
        onClick={this.handleCategoryClick}
        xs={12}
        sm={6}
      >
        <Card
          hoverable
          id="category-card"
          title={
            category.categoryId === "1"
              ? "Хлеб"
              : category.categoryId === "2"
                ? "Кофе"
                : category.categoryId === "3" ? "Кондитерка" : "На заказ"
          }
        >
          <CategoryImage
            crossOrigin="anonymous"
            placeholder={
              category.categoryName === "bread"
                ? tinyBread
                : category.categoryName === "coffee"
                  ? tinyCoffee
                  : category.categoryName === "cakes" ? tinyCakes : tinyOrder
            }
            src={
              category.categoryName === "bread"
                ? `${config.s3.URL}/150x150/bread.jpg`
                : category.categoryName === "coffee"
                  ? `${config.s3.URL}/150x150/coffee.jpg`
                  : category.categoryName === "cakes"
                    ? `${config.s3.URL}/150x150/cakes.jpg`
                    : `${config.s3.URL}/150x150/order.jpg`
            }
            transition="all 1.5s linear"
          />
        </Card>
      </CategoryCard>
    ));
  }

  handleCategoryClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  };

  renderOffer() {
    if (this.state.offercontent && this.state.offerimage)
      return (
        <LazyLoad offset={100} height={200}>
          <OfferCard
            src={`${config.s3.URL}/350x350/${this.state.offerimage}`}
            placeholder={logoImg}
            transition="all 1s linear"
            crossOrigin="anonymous"
          />
        </LazyLoad>
      );
  }

  renderTabletOffer() {
    if (this.state.offercontent && this.state.offerimage)
      return (
        <TabletOfferCard>
          <OfferCard
            src={`${config.s3.URL}/350x350/${this.state.offerimage}`}
            placeholder={logoImg}
            transition="all 1s linear"
            crossOrigin="anonymous"
          />
          <Card>
            <Meta
              title="Спецпредложение"
              description={this.state.offercontent && this.state.offercontent}
            />
          </Card>
        </TabletOfferCard>
      );
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  openInstafeed = () => {
    this.setState({
      instafeed: true
    });
  };

  render() {
    return (
      <div>
        <Desktop>
          <div className="tile is-ancestor">
            <div className="tile is-parent">
              <div className="tile is-parent is-8">
                <RowCard title="Наш ассортимент" className="tile is-child box">
                  <Row>
                    {this.state.categories &&
                      this.renderCategories(this.state.categories)}
                  </Row>
                </RowCard>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <a
                    onClick={() => {
                      this.setModalVisible(true);
                    }}
                  >
                    <OfferDesktopCard
                      title={
                        <button
                          className="ant-btn ant-btn-primary"
                          onClick={() => {
                            this.setModalVisible(true);
                          }}
                        >
                          <Icon type="select" />Спецпредложение
                        </button>
                      }
                    >
                      {this.renderOffer()}
                    </OfferDesktopCard>
                  </a>
                </div>
              </div>
            </div>
            <Modal
              title={this.state.offercontent && this.state.offercontent}
              wrapClassName="vertical-center-modal"
              visible={this.state.modalVisible}
              onOk={() => this.setModalVisible(false)}
              onCancel={() => this.setModalVisible(false)}
            >
              <ModalImage
                crossOrigin="anonymous"
                src={`${config.s3.URL}/500x500/${this.state.offerimage}`}
                placeholder={logoImg}
                transition="all 1s linear"
                id="offer-modal"
              />
            </Modal>
          </div>
          <div className="tile is-ancestor">
            <Instafeed />
          </div>
          <NewsFeed />
        </Desktop>
        <Tablet>
          <div style={{marginTop: '2.25rem'}} className="tile is-ancestor">
            <div className="tile is-parent">
              <RowCard title="Наш ассортимент" className="tile is-child box">
                <Row>
                  {this.state.categories &&
                    this.renderCategories(this.state.categories)}
                </Row>
              </RowCard>
            </div>
            <div className="tile is-parent">
              <Row>
                <Col xs={24}>
                  <div className="box">
                    <a
                      onClick={() => {
                        this.setModalVisible(true);
                      }}
                    >
                      <Card>{this.renderTabletOffer()}</Card>
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
              onCancel={() => this.setModalVisible(false)}
            >
              <ModalImage
                crossOrigin="anonymous"
                src={`${config.s3.URL}/700x700/${this.state.offerimage}`}
                placeholder={logoImg}
                transition="all 1s linear"
                id="offer-modal"
              />
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
                  <Row>
                    {this.state.categories &&
                      this.renderCategories(this.state.categories)}
                  </Row>
                </RowCard>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <a
                    onClick={() => {
                      this.setModalVisible(true);
                    }}
                  >
                  <MobileOfferCard
                    title={
                      <button
                        className="ant-btn"
                        onClick={() => {
                          this.setModalVisible(true);
                        }}
                      >
                        <Icon type="select" />Спецпредложение
                      </button>
                    }
                  >
                    {this.renderOffer()}
                  </MobileOfferCard>
                  </a>
                </div>
              </div>
            </div>
            <Modal
              title={this.state.offercontent && this.state.offercontent}
              wrapClassName="vertical-center-modal"
              visible={this.state.modalVisible}
              onOk={() => this.setModalVisible(false)}
              onCancel={() => this.setModalVisible(false)}
            >
              <ModalImage
                crossOrigin="anonymous"
                src={`${config.s3.URL}/300x300/${this.state.offerimage}`}
                placeholder={logoImg}
                transition="all 1s linear"
                id="offer-modal"
              />
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
        <Row style={{ marginBottom: 45, textAlign: "center" }}>
          <Col
            xs={{ span: 24 }}
            style={{ background: "rgba(234,204,178,.5)", padding: 10 }}
          >
            <p className="has-text-weight-semibold">Наши часы работы:</p>
            <p>с понедельника по субботу: с 8.00 до 20.00 часов;</p>
            <p>в воскресенье: с 9.00 до 18.00 часов.</p>
          </Col>
        </Row>
      </div>
    );
  }
}
