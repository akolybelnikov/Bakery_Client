import React, { Component } from "react";
import { Form, Icon, Input, Upload, Button, Select } from 'antd';
import LoaderButton from "../../components/LoaderButton";
import Center from 'react-center';
import ProductForm from "../../components/ProductForm";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

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

    render() {
        const isLoggedIn = this.props.isAuthenticated;
        if (isLoggedIn) {
            return this.state.product && <ProductForm />;
        } else { this.props.history.push('/login') }
    }

}