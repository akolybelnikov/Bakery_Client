import React from "react";
import { Form, Icon, Input, Upload, Button, Select, Col, Modal } from 'antd';
import LoaderButton from "../components/LoaderButton";
import Center from 'react-center';
import config from "../config";

const FormItem = Form.Item;   
const TextArea = Input;
const Option = Select.Option;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ProductForm extends React.Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            deleting: false,
            loading: false,
            previewImage: this.props.product.attachment
        };
    }

    componentDidMount() {
        this.props.form.setFieldsValue({category: this.props.product.category});
        this.props.form.setFieldsValue({name: this.props.product.productName});
        this.props.form.setFieldsValue({content: this.props.product.content});
        this.props.form.setFieldsValue({price: this.props.product.price})
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async event => {
        event.preventDefault();
      
        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
          alert("Please pick a file smaller than 5MB");
          return;
        }
      
        this.setState({ isLoading: true });
    }

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
    }

    handleDelete = async event => {
        event.preventDefault();
      
        const confirmed = window.confirm(
          "Are you sure you want to delete this note?"
        );
      
        if (!confirmed) {
          return;
        }
      
        this.setState({ isDeleting: true });
    }

    render() {
        const { previewImage } = this.state;
        const props = {
            beforeUpload: (file) => {
                this.file = file;
                console.log(file);
                var reader = new FileReader();
                var url = reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    this.setState({
                        previewImage: [reader.result]
                    })
                  }.bind(this);
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
            <Col xs={{span: 14, offset: 5}} md={{ span: 12, offset: 6 }} lg={{ span: 10, offset: 7 }}>
                <Center style={{'margin': '20px 0'}}><p className="is-size-4 has-text-dark title">Изменить продукт</p></Center>
                <Center>
                    <div style={{width: "100%"}} >
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={categoryError ? 'error' : ''} help={categoryError || ''}>
                                {getFieldDecorator('category', {
                                    rules: [{ required: true, message: 'Please choose a product category' }],
                                })(
                                    <Select placeholder="Category">
                                        <Option value="coffee">Хлеб и булки</Option>
                                        <Option value="bread">Кофе и другие напитки</Option>
                                        <Option value="cakes">Кондитерские изделия</Option>
                                        <Option value="order">Торты на заказ</Option>
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
                            <figure>
                                <img alt="preview" src={previewImage} />
                            </figure>
                            <FormItem >
                                <Upload onRemove={this.handleCancel} {...props}>
                                    <Button className="button is-info is-outlined"><Icon type="upload" />Изменить изображение</Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <LoaderButton style={{width: "100%", color: "black"}} className="button is-warning" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Сохранить изменения" loadingText="Logging in ..." />
                            </FormItem>
                        </Form>
                        <LoaderButton style={{width: "100%"}} className="button is-danger is-outlined" loading={this.state.deleting} text="Удалить продукт" loadingText="Deleting ..." 
                        onClick={this.handleDelete}/>
                    </div>
                </Center>
            </Col>
        );
    }

}

export default Form.create()(ProductForm);