import React from "react";
import { Form, Icon, Input, Upload, Button, Col, notification } from 'antd';
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import { invokeApig, s3Upload, s3Delete } from "../../libs/awsLib";

const FormItem = Form.Item;   
const {TextArea} = Input;

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
            previewImage: `${config.s3.URL}/250x250/${this.props.product.image}`
        };
    }

    componentDidMount() {
        this.props.form.setFieldsValue({name: this.props.product.productName});
        this.props.form.setFieldsValue({content: this.props.product.content});
        this.props.form.setFieldsValue({price: this.props.product.price});
        this.props.form.setFieldsValue({weight: this.props.product.weight});
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    saveProduct(product) {
        return invokeApig({
            path: `/products/${this.props.product.productId}/${this.props.location}`,
            method: "PUT",
            body: product
        });
    }

    handleSubmit = async event => {
      
        let uploadedFileLocation;
        let uploadedFileName;
        event.preventDefault();
      
        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
          alert("Размер изображения не должен превышать 5МБ");
          return;
        }
      
        this.setState({ loading: true });

        try {
            if (this.file) {
                uploadedFileLocation = (await s3Upload(this.file)).Location;
                uploadedFileName = uploadedFileLocation.split('/')[3];
                if (this.props.product.attachment) {
                    const s3File = this.props.product.attachment.match(/(?:.*?\/){3}(.*)/);
                    await s3Delete(unescape(s3File[1]));
                }
            }

            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.saveProduct({
                        productname: values['name'],
                        content: values['content'],
                        price: values['price'],
                        weight: values['weight'],
                        attachment: uploadedFileLocation || this.props.product.attachment,
                        image: uploadedFileName || this.props.product.image
                    });
                    this.openNotification();
                    this.props.history.push("/admin");
                }
            });

        } catch (e) {
            console.log(e.message);
            this.setState({ loading: false});
        }
    }

    openNotification = () => {
        notification.open({
          message: 'Всё прошло успешно!',
          description: 'Загрузка завершена.',
          icon: <Icon type="smile-circle" style={{ color: "#52082D" }} />,
        });
    };

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
    }

    handleFormCancel = () => {
        this.props.history.push(`/admin/${this.props.product.category}`);
    }

    deleteProduct() {
        return invokeApig({
            path: `/products/${this.props.product.productId}/${this.props.location}`,
            method: "DELETE"
        });
    }

    handleDelete = async event => {
        event.preventDefault();
      
        const confirmed = window.confirm(
          "Удалить продукт из базы данных?"
        );
      
        if (!confirmed) {
          return;
        }
      
        this.setState({ deleting: true });

        try {

            if (this.props.product.attachment) {
                const s3File = this.props.product.attachment.match(/(?:.*?\/){3}(.*)/);
                await s3Delete(unescape(s3File[1]));
            }

            await this.deleteProduct();
            this.props.history.push("/admin");

        } catch (e) {
            console.log(e);
            this.setState({ deleting: false});
        }
    }

    render() {
        const { previewImage } = this.state;
        const props = {
            beforeUpload: (file) => {
                this.file = file;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    this.setState({
                        previewImage: [reader.result]
                    })
                  }.bind(this);
                return false;
            }
        }
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const nameError = isFieldTouched('name') && getFieldError('name');
        const contentError = isFieldTouched('content') && getFieldError('content');
        const priceError = isFieldTouched('price') && getFieldError('price');
        const weightError = isFieldTouched('weight') && getFieldError('weight');
        return (
            <Col xs={{span: 20, offset: 2}} md={{ span: 18, offset: 3 }} lg={{ span: 14, offset: 5 }}>
                <p style={{color: "#331507", margin: '0 auto'}} className="is-size-7-mobile is-size-6-tablet title">Внесите изменения или удалите продукт из категории.</p>            
                <div style={{width: "100%"}} >
                    <Form onSubmit={this.handleSubmit}>
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
                        <FormItem validateStatus={weightError ? 'error' : ''} help={weightError || ''}>
                            {getFieldDecorator('weight', {
                                rules: [{ required: true, message: 'Внесите вес продукта' }],
                            })(
                                <Input type="string" placeholder="Вес продукта: 130гр. / 150 мл." />
                            )}
                        </FormItem>
                        <figure>
                            <img alt="" src={previewImage} />
                        </figure>
                        <FormItem>
                            <Upload onRemove={this.handleCancel} {...props}>
                                <Button className="button is-info"><Icon type="upload" />Изменить изображение</Button>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <LoaderButton style={{width: "100%"}} className="button is-warning is-inverted" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Сохранить изменения" loadingText="Загрузка ..." />
                        </FormItem>
                    </Form>
                    <LoaderButton style={{width: "100%", marginBottom: '20px'}} className="button is-primary" loading={this.state.loading} text="Отменить" onClick={this.handleFormCancel}/>
                    <LoaderButton style={{width: "100%"}} className="button is-danger" loading={this.state.deleting} text="Удалить продукт" loadingText="Удаляется ..." 
                    onClick={this.handleDelete}/>
                </div>         
            </Col>
        );
    }

}

export default Form.create()(ProductForm);