import React, { Component } from "react";
import { Row, Col, Card, Breadcrumb } from 'antd';
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
// import Center from 'react-center';
import { invokeOpenApi } from "../../libs/awsLib";
import "./Product.css";
const zoomInAnimation = keyframes`${zoomIn}`;
const bgImg = require(`../../public/bg.jpg`);

const CardImage = styled(ProgressiveImage)`
    background-size: cover;
    background-position: center top;
    min-height: 460px;
    @media only screen and (max-width: 480px) {
        background-size: cover;
        background-position: top;
        min-height: 250px;
    } 
`
const ProductRow = styled(Row)`
    margin: 5% 0;
    @media only screen and (max-width: 768px) {
        margin: 25% 0;
    } 
`
const ProductCard = styled(Card)`
    animation: 1s ${zoomInAnimation};
`

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
        return invokeOpenApi({ path: `/products/${this.props.match.params.id}` });
    }

    renderProduct(product) {
        return(
            <Col xs={{ span: 18, offset: 3 }} sm={{ span: 14, offset: 5 }} md={{ span: 12, offset: 6 }} >
                <ProductCard title={product && product.productName}>
                    <CardImage src={product && product.attachment} placeholder={bgImg} transition="all 1s linear"/>
                    <div><p className="is-size-5-desktop is-size-6-mobile is-size-6-tablet">{product.content}</p></div>
                    <div><p style={{textAlign: 'right', color: '#FA90BA'}} className="is-size-5-desktop is-size-7-mobile is-size-6-tablet">{product.price} руб.</p></div>
                </ProductCard>
            </Col>
        );
    }

    render() {
        return (
            <div>
                <Row>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/">Новинки</Breadcrumb.Item>
                        <Breadcrumb.Item href="/products">Ассортимент</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/products/${this.props.match.params.category}`}>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.product &&  this.state.product.productName}</Breadcrumb.Item>
                    </Breadcrumb>
                </Row>
                <ProductRow>
                    {this.state.product && this.renderProduct(this.state.product)}
                </ProductRow>
            </div>
        );
    }

}

// 
// 