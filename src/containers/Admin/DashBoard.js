import React from "react";
import { invokeOpenApi, signOutUser } from "../../libs/awsLib";
import { Row, Col, Card } from 'antd';
import { Link } from "react-router-dom";

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

    handleLogout = (e) => {
        signOutUser();
    
        this.props.userHasAuthenticated(false);        
        this.props.history.push('/');
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
                    <div><p style={{overflow: "hidden"}} className="is-size-6-desktop is-size-7-mobile is-size-6-tablet">{product.content}</p></div>
                    <div>{product.price}</div>
                </Card>
            </Col>
        )
    }

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <Row className="section" key={category.title} style={{padding: ".5rem .5rem"}}>
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
                    <Row style={{marginTop: "10px"}}>
                        <p className="has-text-info is-size-7-mobile is-size-5-tablet">Управление продуктами</p>
                        <p className="has-text-grey-light is-size-7-mobile is-size-5-tablet">Выберите продукт и внесите изменения. Либо удалите продукт из категории.</p>
                    </Row>
                    <Row style={{marginTop: "10px"}}>
                        <Link to="/create" className="button is-small-mobile is-outlined is-warning is-medium-tablet">
                            <span className="icon is-small"><i className="fa fa-plus"></i></span>
                            <span>Создать продукт</span>
                        </Link>
                    <a  onClick={this.handleLogout} className="button is-small-mobile is-outlined is-medium-tablet is-danger is-pulled-right">
                        <span className="icon is-small" ><i className="fa fa-sign-out"></i></span>
                        <span>Выйдти</span>
                    </a>
                    </Row>
                    {this.state.categories && this.renderCategories(this.state.categories)}
                </div>
            );
        } else { this.props.history.push('/login')}
        
    }


}