import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon } from 'antd';
import styled from 'styled-components';
import { invokeOpenApi } from "../../libs/awsLib";
import ProgressiveImage from 'react-progressive-bg-image';
import config from "../../config";
import "./Category.css";

const bgImg = require(`../../public/logo.png`);

const ProductsRow = styled(Row)`
    margin: 5% 0;
`;

const BreadCrumbs = styled(Row)`
    margin-top: 35px;
`;

const ProductImage = styled(ProgressiveImage)`
    background-size: cover;
    background-position: center center;
    min-height: 200px;
    @media only screen and (max-width: 480px) {
        min-height: 100px;
    }
`

export default class Product extends React.Component {
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
            <Col key={product.productId} xs={8} sm={6} xl={6}>
                <Card style={{ cursor: 'pointer'}}              
                    href={`/products/${this.props.match.params.category}/${product.productId}`}
                    onClick={this.handleProductClick}
                    title={product.productName}>
                    <ProductImage src={`${config.s3.URL}/200x200/${product.image}`} placeholder={bgImg} transition="all 1s linear" />
                </Card>
            </Col>
        )
    }

    render() {
        return (
            <div>
                <Row className="is-hidden-tablet" style={{marginTop: "10px"}}><Icon onClick={this.props.history.goBack} className="icon-back" type="left" /></Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <ProductsRow>
                    {this.renderProducts(this.state.products)}
                </ProductsRow>
            </div>
        );
    }

}
