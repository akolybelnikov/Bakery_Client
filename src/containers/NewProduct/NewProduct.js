import React, { Component } from "react";
// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input, Upload, Button, Select } from 'antd';
import Center from 'react-center';
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import { invokeApig, s3Upload } from "../../libs/awsLib";
import "./NewProduct.css";

const FormItem = Form.Item;   
const TextArea = Input;
const Option = Select.Option;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class NewProduct extends Component {
    constructor(props) {
        super(props);

        this.file = null;
        
        this.state = {
            uploading: false,
            loading: false
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert("Please pick a file smaller than 5MB");
            return;
        }

        this.setState({ loading: true });

        try {
            const uploadedFilename = this.file ? (await s3Upload(this.file)).Location : null;

            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.createProduct({
                        category: values['category'],
                        productname: values['name'],
                        content: values['content'],
                        price: values['price'],
                        attachment: uploadedFilename
                    });
                    this.props.history.push("/admin");
                }
            });

        } catch (e) {
            alert(e.message);
            this.setState({ loading: false });
        } 

        this.props.form.resetFields();
        
        this.props.form.validateFields();
    }

    createProduct(product) {
        return invokeApig({
            path: "/products",
            method: "POST",
            body: product
        });
    }

    render() {
        const props = {
            beforeUpload: (file) => {
                this.file = file;
                return false;
            }
        }
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const categoryError = isFieldTouched('category') && getFieldError('category');
        const nameError = isFieldTouched('name') && getFieldError('name');
        const contentError = isFieldTouched('content') && getFieldError('content');
        const priceError = isFieldTouched('price') && getFieldError('price');
        return (
            <div>
                <Center style={{'marginBottom': '20px'}}><p className="is-size-4 has-text-dark title">Create new product</p></Center>
                <Center>
                    <div className="Form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={categoryError ? 'error' : ''} help={categoryError || ''}>
                                {getFieldDecorator('category', {
                                    rules: [{ required: true, message: 'Please choose a product category' }],
                                })(
                                    <Select placeholder="Category">
                                        <Option value="coffee">Coffee</Option>
                                        <Option value="bread">Bread</Option>
                                        <Option value="cakes">Cakes</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Please provide a product name' }],
                                })(
                                    <Input type="string" placeholder="Product name" />
                                )}
                            </FormItem>
                            <FormItem validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
                                {getFieldDecorator('content', {
                                    rules: [{ required: true, message: 'Please provide a product description' }],
                                })(
                                    <TextArea type="string" rows={4} placeholder="Product description" />
                                )}
                            </FormItem>
                            <FormItem validateStatus={priceError ? 'error' : ''} help={priceError || ''}>
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: 'Please provide a product price' }],
                                })(
                                    <Input  type="number" placeholder="Product price: 00.00" />
                                )}
                            </FormItem>
                            <FormItem >
                                <Upload {...props}>
                                    <Button><Icon type="upload" />Select image</Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Create product" loadingText="Logging in ..." />
                            </FormItem>
                        </Form>
                    </div>
                </Center>
            </div>
        );
    }
}
export default Form.create()(NewProduct);