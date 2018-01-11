import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon, Avatar, Spin } from 'antd';
import ProgressiveImage from "react-progressive-bg-image";
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import Responsive from 'react-responsive';
import "./Product.css";

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const { Meta } = Card;
const avatar = require(`../../public/logobw.png`);

const zoomInAnimation = keyframes`${zoomIn}`;

const bgImg = require(`../../public/logo.png`);

const ProductRow = styled(Row)`
    @media only screen and (max-width: 768px) {
        margin: 10% 0 0 0;
    }
    @media only screen and (min-width: 769px) {
        margin: 5% 0 0 0;
    }
`;

const ProductImage = styled(ProgressiveImage)`
    background-size: contain;
    background-position: center center;
    height: 500px;
    width: 500px;
    max-width: 100%;
    @media only screen and (max-width: 480px) {
        max-width: 100%;
        height: 200px;
    }
    @media only screen and (min-width: 992px) {
        width: 750px;
        max-width: 100%;
    }
`

const ProductCard = styled(Card)`
    animation: 1s ${zoomInAnimation};
`;
const Breadcrumbs = styled(Row)`
    margin-top: 5%;
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
            console.log(e);
        }
    }

    getProduct() {
        return invokeOpenApi({ path: `/products/${this.props.match.params.id}/${this.props.location.pathname.split('/')[2]}` });
    }

    handleClick = event => {
        event.preventDefault();
        this.props.history.push(`/products/${this.state.product.category}`);
    }

    renderProduct(product) {
        return(
            <Col xs={{ span: 20, offset: 2 }} sm={{ span: 18, offset: 3 }} md={{ span: 16, offset: 4 }}>
                <Mobile>
                    <ProductCard 
                        cover={<ProductImage src={`${config.s3.URL}/300x300/${this.state.product.image}`}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{product && product.weight}</p>, <p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{product && product.price} руб.</p>]}>
                        <Meta 
                            title={product && product.productName}
                            avatar={<Avatar src={avatar} />}
                            description={product && product.content} />
                    </ProductCard>
                </Mobile>
                <Tablet>
                    <ProductCard 
                        cover={<ProductImage src={`${config.s3.URL}/500x500/${this.state.product.image}`}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{product && product.weight}</p>, <p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{product && product.price} руб.</p>]}>
                        <Meta 
                            title={product && product.productName}
                            avatar={<Avatar src={avatar} />}
                            description={product && product.content} />
                    </ProductCard>
                </Tablet>
                <Desktop>
                    <ProductCard 
                        cover={<ProductImage src={`${config.s3.URL}/750x750/${this.state.product.image}`}  placeholder={bgImg} transition="all 1s linear" />}
                        actions={[<p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{product && product.weight}</p>, <p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{product && product.price} руб.</p>]}>
                        <Meta 
                            title={product && product.productName}
                            avatar={<Avatar src={avatar} />}
                            description={product && product.content} />
                    </ProductCard>
                </Desktop>
            </Col>
        );
    }

    render() {
        return (
            <div style={{height: '100vh'}}>
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