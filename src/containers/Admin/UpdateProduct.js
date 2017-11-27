import React from "react";
import { Row, Icon } from 'antd';
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
            return this.state.product && 
            <div>
                <Row>
                    <Icon onClick={this.props.history.goBack} className="is-size-5-tablet is-size-6-mobile has-text-grey title" type="left-circle-o" />
                </Row>
                <Row>
                    <ProductForm history={this.props.history} product={this.state.product}/>
                </Row>
            </div>
            
        } else { this.props.history.push('/login') }
    }

}