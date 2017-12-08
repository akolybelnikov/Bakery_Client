import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb } from 'antd';
import styled from 'styled-components';
import { invokeOpenApi } from "../../libs/awsLib";
import "./Category.css";

const ProductsRow = styled(Row)`
    margin: 5% 0;
    @media only screen and (max-width: 768px) {
        
    } 
`

const BreadCrumbs = styled(Row)`
    margin: 0;
`

export default class Product extends Component {
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
                products: results,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getProducts() {
        return invokeOpenApi({ path: `/categories/${this.props.match.params.category}` });
    }

    handleProductClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderProducts(products) {
        return products.map(
            (product) =>
            <Col key={product.productId} xs={12} sm={6} xl={6}>
                <Card style={{ cursor: 'pointer'}}              
                    href={`/products/${this.props.match.params.category}/${product.productId}`}
                    onClick={this.handleProductClick}
                    title={product.productName}
                    ><div><img alt="product" src={product.attachment} /></div>
                    <div>{product.price} руб.</div>
                </Card>
            </Col>
        )
    }

    render() {
        return (
            <div>
                <BreadCrumbs>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <ProductsRow>
                    {this.renderProducts(this.state.products)}
                </ProductsRow>
            </div>
        );
    }

}
