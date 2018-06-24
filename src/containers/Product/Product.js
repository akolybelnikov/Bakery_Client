import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon, Avatar, Spin, notification } from 'antd';
import ProgressiveImage from "react-progressive-bg-image";
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import Responsive from 'react-responsive';
import "./Product.css";
import localforage from 'localforage';

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const { Meta } = Card;
const avatar = require(`../../public/logobw.png`);

const zoomInAnimation = keyframes`${zoomIn}`;

const bgImg = require(`../../public/logo.png`);
const bwlogo = require(`../../public/logobw.png`);

const ProductRow = styled(Row)`
    margin: 5% 0 0;
    @media only screen and (max-width: 480px) {
        margin-bottom: 10%;
    }
`;

const ProductImage = styled(ProgressiveImage)`
    background-size: contain;
    background-position: center center;
    height: 500px;
    width: 500px;
    max-width: 100%;

    @media only screen and (max-width: 480px) {
        width: 300px;
        max-height: 300px;
    }

    @media only screen and (min-width: 992px) {
        width: 750px;
    }
`

const ProductCard = styled(Card)`
    animation: 1s ${zoomInAnimation};

    .ant-card-head{
        background: rgba(234, 204, 178, .75);
    }

    .ant-card-actions {
        background: rgba(234, 204, 178, .75);
        li {
            color: #52082D;
            font-weight: 500;
            span {
                a {
                    color: white;
                    font-size: 18px;
                }
            }
            i {
                margin-right: 5px;
            }
        }
        .product-card-action {
            margin-left: 10px;
        }
    }

    .ant-card-meta-title {
        display: flex;
    }

    .product-card-title {
        width: 50%;
        text-align: center;
        i {
            margin-right: 5px;
        }
    }

    @media screen and (max-width: 767px) {
        .ant-card-actions > li > span {
            font-size: 16px;
        }
    }

    @media screen and (min-width: 768px) {
        .ant-card-actions > li > span {
            font-size: 18px;
            a {
                font-size: 18px;
            }
        }
    }
`;
const Breadcrumbs = styled(Row)`
    margin-top: 80px;
`;

export default class Product extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          product: null,
          category: null
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getProduct();
            this.setState({
                product: results
            });
        } catch (e) {
            this.openErrorNotification();
        }
    }

    async shouldComponentUpdate() {
        if (this.props.location !== this.props.history.location) {
            try { 
                const results = await this.updateProduct();
                this.setState({
                    product: results,
                });
            } catch (e) {
                this.openErrorNotification();
            }
        }
        return true;
    }

    async getProduct() {
        try {
            const products = await localforage.getItem("products")

            if (products) {
                const product = products.find(product => product.productId === this.props.match.params.id)
                if (product) return product
            }           

            const fetchedProduct = await invokeOpenApi({ path: `/products/${this.props.match.params.id}/${this.props.location.pathname.split('/')[2]}` })
   
            return fetchedProduct
            
        } catch (e) {
            this.openErrorNotification()
        }
    }

    async updateProduct() {
        try {
            const products = await localforage.getItem("products")
            if (products) {
                const product = products.find(product => product.productId === this.props.match.params.id);
                if (product) return product
            }            

            const fetchedProduct = await invokeOpenApi({ path: `/products/${this.props.history.location.pathname.split('/')[3]}/${this.props.history.location.pathname.split('/')[2]}` });
            return fetchedProduct;
            
        } catch (e) {
            this.openErrorNotification();
        }
    }

    handleClick = event => {
        event.preventDefault();
        this.props.history.push(`/products/${this.state.product.category}`);
    }

    openErrorNotification () {
        notification['error']({
          message: 'Произошла ошибка при загрузке.',
          description: 'Пожалуйста, попробуйте загрузить приложение позже.'
        });
    };

    renderMobileSorts(sorts) {
        let parsedSorts = sorts.split(';');
        return (
            parsedSorts.map((sort) =>
                <span key={sort} style={{color: "rgba(234, 204, 178, 1)", backgroundColor: "rgba(51, 21, 7, 1)"}} className="tag is-rounded">{sort}</span>          
            )
        );
    }

    renderTabletSorts(sorts) {
        let parsedSorts = sorts.split(';');
        return (
            parsedSorts.map((sort) =>
                <span key={sort} style={{color: "rgba(234, 204, 178, 1)", backgroundColor: "rgba(51, 21, 7, 1)"}} className="tag is-medium is-rounded">{sort}</span>          
            )
        );
    }

    renderDesktopSorts(sorts) {
        let parsedSorts = sorts.split(';');
        return (
            parsedSorts.map((sort) =>
                <span key={sort} style={{color: "rgba(234, 204, 178, 1)", backgroundColor: "rgba(51, 21, 7, 1)"}} className="tag is-medium is-rounded">{sort}</span>          
            )
        );
    }

    renderProduct(product) {
        return(
            <Col style={{marginBottom: '10%'}} xs={{ span: 22, offset: 1 }} sm={{ span: 18, offset: 3 }} md={{ span: 16, offset: 4 }}>
                <Mobile>
                    <ProductCard 
                        title={product && product.productName}
                        cover={<ProductImage src={`${config.s3.URL}/300x300/${this.state.product.image}` || bwlogo}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<a href="tel:+79266298726" target="_self" name="phone number" className="ant-btn ant-btn-primary"><Icon type="customer-service" /><span className="product-card-action">Заказать</span></a>]}>
                        <Meta 
                            title={[<span key="1" className="product-card-title"><Icon type="info-circle-o" />{product && product.weight}</span>, <span key="2" className="product-card-title"><Icon type="tag-o" />{product && product.price} руб.</span>]}
                            description={product && <div>{product.sort && product.sort !== "" && this.renderMobileSorts(product.sort)}<p>{product.content}</p></div>} />
                    </ProductCard>
                </Mobile>
                <Tablet>
                    <ProductCard 
                        title={product && product.productName}
                        cover={<ProductImage src={`${config.s3.URL}/500x500/${this.state.product.image}` || bwlogo}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<div><Icon type="info-circle-o" /><span>{product && product.weight}</span></div>, <div><Icon type="tag-o" /><span className="is-size-6-tablet">{product && product.price} руб.</span></div>, <a href="tel:+79266298726" target="_self" name="phone number" className="ant-btn ant-btn-primary"><Icon type="customer-service" /><span className="product-card-action">Заказать</span></a>]}>
                        <Meta
                            description={product && <div>{product.sort && product.sort !== "" && this.renderTabletSorts(product.sort)}<p>{product.content}</p></div>} />
                    </ProductCard>
                </Tablet>
                <Desktop>
                    <ProductCard 
                        title={product && product.productName}
                        cover={<ProductImage src={`${config.s3.URL}/750x750/${this.state.product.image}` || bwlogo}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<div><Icon type="info-circle-o" />{product && product.weight}</div>, <div><Icon type="tag-o" />{product && product.price} руб.</div>, <a href="tel:+79266298726" target="_self" name="phone number" className="ant-btn ant-btn-primary"><Icon type="customer-service" /><span className="product-card-action">Заказать</span></a>]}>
                        <Meta 
                            avatar={<Avatar src={avatar} />}
                            description={product && <div className="tags">{product.sort && product.sort !== "" && this.renderDesktopSorts(product.sort)}<p>{product.content}</p></div>}/>
                    </ProductCard>
                </Desktop>
            </Col>
        );
    }

    render() {
        return (
            <div>
                <Row className="is-hidden-tablet" style={{marginTop: "35px"}}><Icon onClick={this.props.history.goBack} className="icon-back" type="left" /></Row>
                <Breadcrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/products/${this.props.match.params.category}`}>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>{this.state.product &&  this.state.product.productName}</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </Breadcrumbs>
                <ProductRow>
                    {this.state.product ? this.renderProduct(this.state.product) : <Spin style={{display: 'block', margin: '15% 0 25% 0'}} size="large" />}
                </ProductRow>
            </div>
        );
    }

}