import React from "react";
import { Form, Icon, Input, Upload, Button, Col, Breadcrumb, Row, notification } from 'antd';
import LoaderButton from "../../components/LoaderButton";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import config from "../../config";
import { invokeOpenApi, invokeApig, s3Upload, s3Delete } from "../../libs/awsLib";

const FormItem = Form.Item;   
const {TextArea} = Input;

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const BreadCrumbs = styled(Row)`
    margin-top: 35px;
`;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UpdateNews extends React.Component {

    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            deleting: false,
            loading: false,
            news: null,
            previewImage: ''
        };
    }

    async componentDidMount() {
        try {
            const result = await this.getNews();
            this.setState({
                news: result,
                previewImage: `${config.s3.URL}/250x250/${result.image}`
            });
            this.props.form.setFieldsValue({content: this.state.news.content});
            this.props.form.validateFields();
        } catch (e) {
            console.log(e);
        }
    }

    getNews() {
        return invokeOpenApi({ path: `/news/${this.props.match.params.id}` });
    }

    saveNews(news) {
        return invokeApig({
            path: `/news/${this.state.news.newsId}`,
            method: "PUT",
            body: news
        });
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
        this.props.history.push('/admin/news');
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
                        this.saveNews({
                            content: values['content'],
                            attachment: uploadedFileLocation || this.state.news.attachment,
                            image: uploadedFileName || this.state.news.image
                        }).then(res => {
                            this.openNotification();
                            this.props.history.push("/admin");
                        });
                  } 
              });
  
          } catch (e) {
              console.log(e.message);
              this.setState({ loading: false});
          }
      }

    deleteNews() {
        return invokeApig({
            path: `/news/${this.state.news.newsId}`,
            method: "DELETE"
        });
    }

    handleDelete = async event => {
        event.preventDefault();
      
        const confirmed = window.confirm(
          "Удалить новость из базы данных?"
        );
      
        if (!confirmed) {
          return;
        }
      
        this.setState({ deleting: true });

        try {

            if (this.state.news.attachment) {
                const s3File = this.state.news.attachment.match(/(?:.*?\/){3}(.*)/);
                await s3Delete(unescape(s3File[1]));
            }

            await this.deleteNews();
            this.props.history.push("/admin/news");

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
        const contentError = isFieldTouched('content') && getFieldError('content');
        return (
            <div style={{height: '100vh', margin: '40px 0'}}>
                <IconRow className="is-hidden-desktop">
                    <Icon onClick={this.props.history.goBack} className="icon-back" type="left" />
                </IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to="#">Изменить продукт</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row>
                    <Col xs={{span: 22, offset: 1}} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }}>
                        <p style={{color: "#331507", margin: '0 auto'}} className="is-size-7-mobile is-size-6-tablet title">Внесите изменения или удалите новость</p>
                        <div style={{width: "100%"}} >
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: 'Внесите описание новости' }],
                                    })(
                                        <TextArea type="string" rows={4} placeholder="Описание новости" />
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
                                    <LoaderButton style={{width: "100%"}} className="button is-warning is-inverted" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Сохранить изменения" loadingText="Logging in ..." />
                                </FormItem>
                            </Form>
                            <LoaderButton style={{width: "100%", marginBottom: '20px'}} className="button is-primary" loading={this.state.loading} text="Отменить" onClick={this.handleFormCancel}/>
                            <LoaderButton style={{width: "100%"}} className="button is-danger" loading={this.state.deleting} text="Удалить новость" loadingText="Deleting ..." 
                            onClick={this.handleDelete}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Form.create()(UpdateNews);