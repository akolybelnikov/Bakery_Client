import React from "react";
import { invokeOpenApi } from "../../libs/awsLib";
import { Row, Col, Card } from 'antd';

export default class AdminDashBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: []
        };
    }

    async componentDidMount() {
        try {
            const bread = await this.getBreadProducts();
            const coffee = await this.getCoffeeProducts();
            const cakes = await this.getCakesProducts();
            const order = await this.getOrderProducts();
            this.setState({categories: [{title: "Хлеб и булки", products: bread}, {title: "Кофе и другие напитки", products: coffee}, {title: "Кондитерские изделия", products: cakes}, {title: "Торты на заказ", products: order}]});
        } catch (e) {
            console.log(e);
        }
    }

    getBreadProducts() {
        return invokeOpenApi({ path: `/categories/bread` });
    }

    getCoffeeProducts() {
        return invokeOpenApi({ path: `/categories/coffee` });
    }

    getCakesProducts() {
        return invokeOpenApi({ path: `/categories/cakes` });
    }

    getOrderProducts() {
        return invokeOpenApi({ path: `/categories/order` });
    }

    handleProductClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderProducts(products) {
        return products.map(
            (product) =>
            <Col key={product.productId} xs={8} sm={4} xl={3}>
                <Card style={{ cursor: 'pointer'}}             
                    href={`/admin/${product.productId}`}
                    onClick={this.handleProductClick}
                    title={product.productName}
                    ><div><img alt="product" src={product.attachment} /></div>
                    <div><p className="is-size-6-desktop is-size-7-mobile is-size-6-tablet">{product.content}</p></div>
                    <div>{product.price}</div>
                </Card>
            </Col>
        )
    }

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <Row className="section" key={category.title}>
                <Col>
                    <Card title={category.title}>{category.products && this.renderProducts(category.products)}</Card>
                </Col>
            </Row>
        )
    }

    render() {
        const isLoggedIn = this.props.isAuthenticated;
        if (isLoggedIn) {
            return (
                <div>
                <Row><p className="has-text-grey-light title">Управление продуктами</p><p className="has-text-grey-lighter subtitle">Выберите продукт и внесите изменения. Либо удалите продукт из категории.</p></Row>
                    {this.state.categories && this.renderCategories(this.state.categories)}
                </div>
            );
        } else { this.props.history.push('/login')}
        
    }


}