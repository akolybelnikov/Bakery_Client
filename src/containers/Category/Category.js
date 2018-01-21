import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon, Spin, List } from 'antd';
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
    margin-top: 50px;
`;

const ProductCard = styled(Card)`
    .ant-card-head{
        background-color: rgba(234, 204, 178, .75);
        padding: 0 10px;
    }

    .ant-card-head-wrapper {
        max-width: 290px;
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
`

const ProductImage = styled(ProgressiveImage)`
    background-size: cover;
    margin: 0 auto;
    background-position: center center;
    width: 300px;
    height: 300px;
    max-width: 100%;
`

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
                products: results,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async shouldComponentUpdate() {
        if (this.props.location !== this.props.history.location) {
            try { 
                const results = await this.getProductsAgain();
                this.setState({
                    products: results,
                });
            } catch (e) {
                console.log(e);
            }
        }
        return true;
    }

    getProducts() {
        return invokeOpenApi({ path: `/categories/${this.props.match.params.category}` });
    }

    getProductsAgain() {
        return invokeOpenApi({ path: `/categories/${this.props.history.location.pathname.split('/')[2]}` });
    }

    handleProductClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    handleClick = event => {
        event.preventDefault();
        this.props.history.push('/products');
    }

    renderProductsList(products) {
        return (
            <List 
                grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
                dataSource={products}
                renderItem={product => (
                    <List.Item>
                        <ProductCard style={{ cursor: 'pointer'}}              
                            href={`/products/${this.props.match.params.category}/${product.productId}`}
                            onClick={this.handleProductClick}
                            title={product.productName}>
                            <ProductImage src={`${config.s3.URL}/300x300/${product.image}`} placeholder={bgImg} transition="all 1s linear" />
                        </ProductCard>
                    </List.Item>
                )}
            />
        )
    }

    render() {
        return (
            <div>
                <Row className="is-hidden-tablet" style={{marginTop: "35px"}}><Icon onClick={this.handleClick} className="icon-back" type="left" /></Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <ProductsRow>
                    <Col xs={24} style={{marginBottom: 30}} >
                        {this.state.products ? this.renderProductsList(this.state.products) : <Spin style={{display: 'block', marginTop: '45px'}} size="large" />}
                    </Col>
                </ProductsRow>
            </div>
        );
    }
}

export default withRouter(Category);
