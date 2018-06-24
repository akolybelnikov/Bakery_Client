import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Breadcrumb,
  Icon,
  Spin,
  List,
  notification
} from "antd";
import styled from "styled-components";
import { invokeOpenApi } from "../../libs/awsLib";
import ProgressiveImage from "react-progressive-bg-image";
import config from "../../config";
import "./Category.css";
import localforage from "localforage";
import LazyLoad from 'react-lazy-load';

const bgImg = require(`../../public/logo.png`);

const ProductsRow = styled(Row)`
  margin: 5% 0;
`;

const BreadCrumbs = styled(Row)`
  margin-top: 80px;
`;

const ProductCard = styled(Card)`
  .ant-card-head {
    background-color: rgba(234, 204, 178, 0.75);
    padding: 0 10px;
  }

  .ant-card-actions {
    background: rgba(234, 204, 178, 0.75);
    li > span {
      font-size: 16px;
      a {
        color: white;
        text-decoration: none;
        :hover,
        :active,
        :visited {
          color: rgba(234, 204, 178, 0.75);
        }
      }
    }
    .category-action {
      margin-left: 10px;
    }
    .category-card-actions-link {
      color: #52082d;
      font-weight: 500;
      :hover,
      :active,
      :visited {
        color: rgba(82, 8, 45, 0.5);
      }
    }
    @media screen and (min-width: 768px) {
      li > span {
        font-size: 18px;
        a {
          font-size: 18px;
        }
      }
    }
  }

  @media only screen and (max-width: 480px) {
    .ant-card-head {
      min-height: 24px;
    }

    .ant-card-head-title {
      white-space: initial;
    }
  }

  @media only screen and (min-width: 768px) {
    .ant-card-head-title {
      font-size: 17px;
      text-overflow: clip;
    }
  }
`;

const ProductImage = styled(ProgressiveImage)`
  background-size: cover;
  margin: 0 auto;
  background-position: center center;
  width: 300px;
  height: 300px;
  max-width: 100%;
`;

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getProducts();
      this.setState({
        products: results
      });
    } catch (e) {
      this.openErrorNotification();
    }
  }

  async shouldComponentUpdate() {
    if (this.props.location !== this.props.history.location) {
      try {
        const results = await this.getProductsAgain();
        this.setState({
          products: results
        });
      } catch (e) {
        this.openErrorNotification();
      }
    }
    return true;
  }

  async getProducts() {
    const hours = 3600000;
    const timecheck = Date.now() - 12 * hours;
    try {
      const fingerprint = await localforage.getItem(
        `${this.props.match.params.category}timestamp`
      );

      const products = await localforage.getItem(
        `${this.props.match.params.category}`
      );

      if (products && fingerprint && fingerprint.createdAt > timecheck) {
        return products;
      } else {
        if (!fingerprint) {
          const timestamp = { createdAt: Date.now() };
          await localforage.setItem(
            `${this.props.match.params.category}timestamp`,
            timestamp
          );
        }

        if (products) {
          await localforage.removeItem(`${this.props.match.params.category}`);
        }

        const fetchedProducts = await invokeOpenApi({
          path: `/categories/${this.props.match.params.category}`
        });
        this.sortByDate(fetchedProducts).reverse();

        await localforage.setItem(
          `${this.props.match.params.category}`,
          fetchedProducts
        );

        return fetchedProducts;
      }
    } catch (e) {
      this.openWarningNotification();
    }
  }

  sortByDate(array) {
    return array.sort((a, b) => a.createdAt - b.createdAt);
  }

  openErrorNotification() {
    notification["error"]({
      message: "Произошла ошибка при загрузке!",
      description: "Пожалуйста, попробуйте загрузить приложение ещё раз."
    });
  }

  openWarningNotification() {
    notification["warning"]({
      message:
        "Произошла ошибка при загрузке! Возможно нет связи с интернетом.",
      description: "Пожалуйста, попробуйте загрузить приложение позже."
    });
  }

  async getProductsAgain() {
    try {
      const products = await localforage.getItem(
        `${this.props.history.location.pathname.split("/")[2]}`
      );
      if (products) {
        return products;
      } else {
        const fetchedProducts = await invokeOpenApi({
          path: `/categories/${
            this.props.history.location.pathname.split("/")[2]
          }`
        });
        this.sortByDate(fetchedProducts).reverse();
        await localforage.setItem(
          `${this.props.history.location.pathname.split("/")[2]}`,
          fetchedProducts
        );
        return fetchedProducts;
      }
    } catch (e) {
      this.openWarningNotification();
    }
  }

  handleProductClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  };

  handleClick = event => {
    event.preventDefault();
    this.props.history.push("/products");
  };

  renderProductsList(products) {
    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
        dataSource={products}
        renderItem={product => (
          <List.Item>
            <ProductCard
              style={{ cursor: "pointer" }}
              title={product.productName}
              actions={[
                <a
                  href="tel:+79266298726"
                  target="_self"
                  name="phone number"
                  className="ant-btn ant-btn-primary"
                >
                  <Icon type="customer-service" />
                  <span className="category-action">Заказать</span>
                </a>,
                <a
                  href={`/products/${this.props.match.params.category}/${
                    product.productId
                  }`}
                  className="category-card-actions-link"
                >
                  <Icon type="select" />
                  <span className="category-action">Посмотреть</span>
                </a>
              ]}
            >
              <LazyLoad offset={200} height={300}>
                <ProductImage
                  href={`/products/${this.props.match.params.category}/${
                    product.productId
                  }`}
                  onClick={this.handleProductClick}
                  src={`${config.s3.URL}/300x300/${product.image}`}
                  placeholder={bgImg}
                  transition="all 1s linear"
                />
              </LazyLoad>
            </ProductCard>
          </List.Item>
        )}
      />
    );
  }

  render() {
    return (
      <div>
        <Row className="is-hidden-tablet" style={{ marginTop: "35px" }}>
          <Icon onClick={this.handleClick} className="icon-back" type="left" />
        </Row>
        <BreadCrumbs className="is-hidden-mobile">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">Новинки</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/products">Ассортимент</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link className="active-link" to="#">
                {this.props.match.params.category === "bread"
                  ? "Хлеб и булки"
                  : this.props.match.params.category === "coffee"
                    ? "Кофе и другие напитки"
                    : this.props.match.params.category === "cakes"
                      ? "Кондитерские изделия"
                      : "Торты на заказ"}
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadCrumbs>
        <ProductsRow>
          <Col xs={24} style={{ marginBottom: 30 }}>
            {this.state.products ? (
              this.renderProductsList(this.state.products)
            ) : (
              <Spin
                style={{ display: "block", marginTop: "45px" }}
                size="large"
              />
            )}
          </Col>
        </ProductsRow>
      </div>
    );
  }
}

export default withRouter(Category);
