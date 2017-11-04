import React, { Component } from "react";
// import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input, Upload, message, Button } from 'antd';
import Center from 'react-center';
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import "./NewProduct.css";

const FormItem = Form.Item;   
const TextArea = Input;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const props = {
  name: 'file',
  action: '',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class NewProduct extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        try {
            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('submitted');
                    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
                        alert("Please pick a file smaller than 5MB");
                        return;
                      }                
                }
            });

        } catch (e) {
            alert(e.message);
            this.setState({ loading: false });
        }  

        this.props.form.resetFields();
        
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const productNameError = isFieldTouched('productName') && getFieldError('productName');
        const productDescriptionError = isFieldTouched('productDescription') && getFieldError('productDescription');
        return (
            <div>
                <Center><p className="is-size-4 has-text-dark title Admin">Create new product</p></Center>
                <Center>
                    <div className="Form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={productNameError ? 'error' : ''} help={productNameError || ''}>
                                {getFieldDecorator('productName', {
                                    rules: [{ required: true, message: 'Please provide a product name' }],
                                })(
                                    <Input type="string" placeholder="Product name" autoFocus/>
                                )}
                            </FormItem>
                            <FormItem validateStatus={productDescriptionError ? 'error' : ''} help={productDescriptionError || ''}>
                                {getFieldDecorator('productDescription', {
                                    rules: [{ required: true, message: 'Please provide a product description' }],
                                })(
                                    <TextArea  type="string" rows={4} placeholder="Product description" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Upload {...props}>
                                    <Button><Icon type="upload" /> Click to Upload</Button>
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