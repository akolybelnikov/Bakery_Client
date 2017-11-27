import React, { Component } from "react";
import { Form, Icon, Input, Upload, Button, Select, Row } from 'antd';
import Center from 'react-center';
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import { invokeApig, s3Upload } from "../../libs/awsLib";
import "./NewProduct.css";

const FormItem = Form.Item;   
const {TextArea} = Input;
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
            loading: false,
            previewImage: ''
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert("Размер изображения не должен превышать 5МБ");
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

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
    }


    createProduct(product) {
        return invokeApig({
            path: "/products",
            method: "POST",
            body: product
        });
    }

    render() {
        const { previewImage } = this.state;
        const props = {
            beforeUpload: (file) => {
                this.file = file;
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
            <div>
                <Row><Icon onClick={this.props.history.goBack} className="is-size-5-tablet is-size-6-mobile has-text-grey title" type="left-circle-o" /></Row>
                <Center style={{'marginBottom': '20px'}}><p className="is-size-5-tablet is-size-6-mobile has-text-info title">Создать новый продукт</p></Center>
                <Center>
                    <div className="Form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={categoryError ? 'error' : ''} help={categoryError || ''}>
                                {getFieldDecorator('category', {
                                    rules: [{ required: true, message: 'Выберите категорию продукта' }],
                                })(
                                    <Select placeholder="Категория">
                                    <Option value="coffee">Хлеб и булки</Option>
                                    <Option value="bread">Кофе и другие напитки</Option>
                                    <Option value="cakes">Кондитерские изделия</Option>
                                    <Option value="order">Торты на заказ</Option>
                                </Select>
                                )}
                            </FormItem>
                            <FormItem validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Внесите название продукта' }],
                                })(
                                    <Input type="string" placeholder="Название продукта" />
                                )}
                            </FormItem>
                            <FormItem validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
                                {getFieldDecorator('content', {
                                    rules: [{ required: true, message: 'Внесите описание продукта' }],
                                })(
                                    <TextArea type="string" rows={4} placeholder="Описание продукта" />
                                )}
                            </FormItem>
                            <FormItem validateStatus={priceError ? 'error' : ''} help={priceError || ''}>
                                {getFieldDecorator('price', {
                                    rules: [{ required: true, message: 'Внесите цену продукта' }],
                                })(
                                    <Input type="number" placeholder="Цена продукта: 00.00" />
                                )}
                            </FormItem>
                            <figure>
                                <img alt="" src={previewImage} />
                            </figure>
                            <FormItem >
                                <Upload onRemove={this.handleCancel} {...props}>
                                    <Button className="button is-info is-outlined"><Icon type="upload" />Выбрать изображение</Button>
                                </Upload>
                            </FormItem>
                            <FormItem>
                                <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Создать продукт" loadingText="Logging in ..." />
                            </FormItem>
                        </Form>
                    </div>
                </Center>
            </div>
        );
    }
}
export default Form.create()(NewProduct);