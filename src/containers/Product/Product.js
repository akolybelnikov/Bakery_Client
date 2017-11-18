import React, { Component } from "react";
// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
// import { Form, Icon, Input, Upload, Button, Select } from 'antd';
// import Center from 'react-center';
// import config from "../../config";
// import LoaderButton from "../../components/LoaderButton";
import { invokeOpenApi } from "../../libs/awsLib";
import "./Product.css";

export default class Product extends Component {
    constructor(props) {
        super(props);
    
        this.file = null;
    
        this.state = {
          note: null,
          content: ""
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getProduct();
            this.setState({
                product: results,
                content: results.content
            });
        } catch (e) {
            console.log(e);
        }
    }

    getProduct() {
        return invokeOpenApi({ path: `/products/${this.props.match.params.id}` });
    }

    render() {
        return <div className="Product"><p>product component rendered</p></div>;
    }

}
