import React from "react";
import { Form, Icon, Input, Upload, Button, Select, Col } from 'antd';
import LoaderButton from "../../components/LoaderButton";
import Center from 'react-center';
import config from "../../config";
import { invokeOpenApi, invokeApig, s3Upload, s3Delete } from "../../libs/awsLib";

const FormItem = Form.Item;   
const {TextArea} = Input;
const Option = Select.Option;

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
            news: null
        };
    }

    async componentDidMount() {
        try {
            const result = await this.getNews();
            this.setState({
                news: result
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

    handleCancel = () => {
        this.file = null;
        this.setState({ previewImage: '' });
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
                          archived: values['archived'],
                          content: values['content'],
                          attachment: uploadedFileLocation || this.state.news.attachment,
                          image: uploadedFileName || this.state.news.image
                      });
                      setTimeout(() => {
                          this.props.history.push("/admin");
                      }, 500);
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

        const archivedError = isFieldTouched('archived') && getFieldError('archived');
        const contentError = isFieldTouched('content') && getFieldError('content');
        return (
            <Col xs={{span: 20, offset: 2}} md={{ span: 18, offset: 3 }} lg={{ span: 14, offset: 5 }}>
                <Center style={{margin: '20px 0'}}><p style={{color: "#331507"}} className="is-size-6-mobile is-size-5-tablet title">Внесите изменения или удалите продукт из категории.</p></Center>
                <Center>
                    <div style={{width: "100%"}} >
                        <Form onSubmit={this.handleSubmit}>
                        <FormItem validateStatus={archivedError ? 'error' : ''} help={archivedError || ''}>
                            {getFieldDecorator('archived', {
                                rules: [{ required: true, message: 'Архивировать новость?' }],
                            })(
                                <Select placeholder="Статус">
                                <Option value="false">Активировать</Option>
                                <Option value="true">Деактивировать</Option>
                            </Select>
                            )}
                        </FormItem>
                            <FormItem validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
                                {getFieldDecorator('content', {
                                    rules: [{ required: true, message: 'Внесите описание продукта' }],
                                })(
                                    <TextArea type="string" rows={4} placeholder="Описание продукта" />
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
                        <LoaderButton style={{width: "100%"}} className="button is-danger" loading={this.state.deleting} text="Удалить новость" loadingText="Deleting ..." 
                        onClick={this.handleDelete}/>
                    </div>
                </Center>
            </Col>
        );
    }

}

export default Form.create()(UpdateNews);