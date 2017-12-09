import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Popover } from 'antd';
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
`;

const ProductRow = styled(Row)`
    @media only screen and (max-width: 480px) {
        margin: 10% 0 25% 0;
    } 
    @media only screen and (min-width: 680px) and (max-width: 768px) {
        margin: 17.5% 0;
    }
`;

const ProductCard = styled(Card)`
    animation: 1s ${zoomInAnimation};
`;
const Breadcrumbs = styled(Row)`
    @media only screen and (max-width: 768px) {
        margin-top: 35px;
    }
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
        return invokeOpenApi({ path: `/products/${this.props.match.params.id}` });
    }

    getContent() {
        return(
            <div>
                <img src={this.state.product.attachment} />
            </div>
        )
    }

    renderProduct(product) {
        return(
            <Col xs={{ span: 20, offset: 2 }} sm={{ span: 18, offset: 3 }} md={{ span: 16, offset: 4 }} >
                <ProductCard title={product && product.productName}>
                    <Popover placement="top" content={this.getContent()} trigger="click">
                        <CardImage src={product && product.attachment} placeholder={bgImg} transition="all 1s linear"/>
                    </Popover>
                    <div>
                        <p style={{textAlign: 'center', color: '#52082D'}} className="is-size-6-desktop is-size-7-mobile">{product.content}</p>
                    </div>
                    <div>
                        <Row>
                            <Col xs={12}><p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{textAlign: 'left', color: '#331507'}}><span style={{color: '#EACCB2'}}>Вес: </span>{product && product.weight}</p></Col>
                            <Col xs={12}><p className="is-size-5-desktop is-size-7-mobile is-size-6-tablet" style={{textAlign: 'right', color: '#331507'}}><span style={{color: '#EACCB2'}}>Цена: </span>{product && product.price} руб.</p></Col>
                        </Row>
                    </div>
                </ProductCard>
            </Col>
        );
    }

    render() {
        return (
            <div>
                <Breadcrumbs>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/products/${this.props.match.params.category}`}>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.product &&  this.state.product.productName}</Breadcrumb.Item>
                    </Breadcrumb>
                </Breadcrumbs>
                <ProductRow>
                    {this.state.product && this.renderProduct(this.state.product)}
                </ProductRow>
            </div>
        );
    }

}

// 
// 