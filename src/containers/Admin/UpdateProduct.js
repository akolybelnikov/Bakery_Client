import React from "react";
import { Row } from 'antd';
import { invokeOpenApi } from "../../libs/awsLib";
import ProductForm from "../../components/ProductForm";

export default class UpdateProduct extends React.Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
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
        return invokeOpenApi({ path: `/products/${this.props.match.params.id}` });
    }

    render() {
        const isLoggedIn = this.props.isAuthenticated;
        if (isLoggedIn) {
            return this.state.product && <Row>
            <ProductForm product={this.state.product}/>;
            </Row>
        } else { this.props.history.push('/login') }
    }

}