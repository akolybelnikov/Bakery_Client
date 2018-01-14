import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Card, Breadcrumb, Icon, Spin, List } from 'antd';
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
                        <Card style={{ cursor: 'pointer'}}              
                            href={`/products/${this.props.match.params.category}/${product.productId}`}
                            onClick={this.handleProductClick}
                            title={product.productName}>
                            <ProductImage src={`${config.s3.URL}/200x200/${product.image}`} placeholder={bgImg} transition="all 1s linear" />
                        </Card>
                    </List.Item>
                )}
            />
        )
    }

    render() {
        return (
            <div style={{height: '100vh'}}>
                <Row className="is-hidden-tablet" style={{marginTop: "35px"}}><Icon onClick={this.handleClick} className="icon-back" type="left" /></Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/products">Ассортимент</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <ProductsRow>
                    {this.state.products ? this.renderProductsList(this.state.products) : <Spin style={{display: 'block', marginTop: '45px'}} size="large" />}
                </ProductsRow>
            </div>
        );
    }
}

export default withRouter(Category);
