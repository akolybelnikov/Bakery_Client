import React, { Component } from "react";
// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Row, Col, Card } from 'antd';
// import Center from 'react-center';
// import config from "../../config";
// import ProductCard from "../../components/ProductCard";
import { invokeOpenApi } from "../../libs/awsLib";
import "./Category.css";

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
                    <div>{product.price}</div>
                </Card>
            </Col>
        )
    }

    render() {
        return (
            <Row>
                {this.renderProducts(this.state.products)}
            </Row>
        );
    }

}
