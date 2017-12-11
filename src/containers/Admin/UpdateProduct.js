import React from "react";
import { Row, Icon } from 'antd';
import { invokeOpenApi } from "../../libs/awsLib";
import ProductForm from "./ProductForm";

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
        return this.state.product && 
            <div>
                <Row style={{marginTop: "10px"}}>
                    <Icon onClick={this.props.history.goBack} className="icon-back" type="left" />
                </Row>
                <Row>
                    <ProductForm history={this.props.history} product={this.state.product}/>
                </Row>
            </div>
    }

}