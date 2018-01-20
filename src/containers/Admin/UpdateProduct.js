import React from "react";
import { Link } from "react-router-dom";
import { Icon, Breadcrumb, Row } from 'antd';
import styled from 'styled-components'
import { invokeOpenApi } from "../../libs/awsLib";
import ProductForm from "./ProductForm";

const BreadCrumbs = styled(Row)`
    margin-top: 20px;
    @media only screen and (max-width: 480px) {
        margin-top: 35px;
    }
`;

export default class UpdateProduct extends React.Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            loading: null,
            deleting: null,
            product: null
        }

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
        this.props.history.push(`/admin/${this.state.product.category}`);
    }

    render() {
        return this.state.product && 
            <div style={{ margin: '40px 0' }}>
                <Row className="is-hidden-tablet" style={{marginTop: "25px"}}>
                    <Icon onClick={this.handleClick} className="icon-back" type="left" />
                </Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/admin/${this.props.match.params.category}`}>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : "Торты на заказ"}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.product && this.state.product.productName}</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row>
                    <ProductForm location={this.props.location.pathname.split('/')[2]} history={this.props.history} product={this.state.product}/>
                </Row>
            </div>
    }

}