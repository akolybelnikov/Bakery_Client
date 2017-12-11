import React from 'react';
import { Form, Icon, Upload, Button, Row, Col, Divider, Breadcrumb } from 'antd';
import { Link } from "react-router-dom";
import styled from 'styled-components'
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import Center from 'react-center';
import { invokeApig, s3Upload } from "../../libs/awsLib";
import "./Admin.css";

const BreadCrumbs = styled(Row)`
    margin-top: 20px;
    @media only screen and (max-width: 480px) {
        margin-top: 35px;
    }
`;

const FormItem = Form.Item;   

class NewOffer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uploading: false,
            loading: false,
            previewImage: ''
        }
    }

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
    }

    handleSubmit = async e => {
        e.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert("Размер изображения не должен превышать 5МБ");
            return;
        }

        this.setState({ loading: true });

        try {
            const uploadedFileLocation = this.file ? (await s3Upload(this.file)).Location : null;
            const uploadedFileName = uploadedFileLocation.split('/')[3];
            await this.createOffer({
                        attachment: uploadedFileLocation,
                        image: uploadedFileName
                    });
                    this.props.history.push("/admin");
        } catch (e) {
            console.log(e);
            alert("Ошибка при загрузке изображения. Спецпредложение не создано");
            this.setState({ loading: false });
        } 
    }

    createOffer(offer) {
        return invokeApig({
            path: "/offers",
            method: "POST",
            body: offer
        });
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
        return (
            <div>
                <Row style={{marginTop: "10px"}}><Icon onClick={this.props.history.goBack} className="icon-back is-hidden-tablet" type="left" /></Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>Новое спецпредложение</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Center style={{marginBottom: '20px', marginTop: "20px"}}><p className="is-size-5-tablet is-size-6-mobile title">Создать новое спецпредложение</p></Center>
                <Row>
                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 18, offset: 3 }} md={{ span: 16, offset: 4 }} >
                        <Center>
                            <div className="Form">
                                <Form onSubmit={this.handleSubmit}>
                                    <figure>
                                        <img alt="preview" src={previewImage} />
                                    </figure>
                                    <FormItem >
                                        <Upload onRemove={this.handleCancel} {...props}>
                                            <Button className="button is-info"><Icon type="upload" />Выбрать изображение</Button>
                                        </Upload>
                                    </FormItem>
                                    <FormItem>
                                        <LoaderButton style={{width: "100%"}} className="button is-warning is-inverted" htmlType="submit" loading={this.state.loading} text="Сохранить спецредложение" loadingText="Logging in ..." />
                                    </FormItem>
                                </Form>
                            </div>
                        </Center>
                    </Col>
                </Row>
            </div>
        );
    }


}

export default Form.create()(NewOffer);