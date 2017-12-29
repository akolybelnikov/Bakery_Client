import React, { Component } from "react";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input, Row, Col, notification } from 'antd';
import Center from 'react-center';
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import "./LoginForm.css";

const FormItem = Form.Item;   

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
        };
    }

    login(email, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });
        const user = new CognitoUser({ Username: email, Pool: userPool });
        const authenticationData = { Username: email, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) => 
            user.authenticateUser(authenticationDetails, {
                onSuccess: result => resolve(),
                onFailure: err => {reject(err); this.failureNotification(err)}
            })
        );
    }

    failureNotification = (e) => {
        notification.open({
            message: 'Ошибка при входе!',
            description: e.message,
            icon: <Icon type="frown-o" style={{ color: "#52082D" }} />
        });
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
                    this.login(values['userName'], values['password']);                    
                } else (alert(err));
            })
            .then(this.props.userHasAuthenticated(true)); 

        } catch (e) {
            this.setState({ loading: false });
        }  

        this.props.form.resetFields();
        
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        return (
            <div style={{height: '60vh'}}>
                <Row style={{marginTop: '25vh'}}>
                    <Col xs={24} sm={{ span: 16, offset: 4 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: 'Please provide your email' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="email" placeholder="Пользователь" autoFocus/>
                                )}
                            </FormItem>
                            <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please provide your password' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="string" placeholder="Пароль" />
                                )}
                            </FormItem>
                            <Center>
                                <FormItem>
                                    <LoaderButton id='login-button' type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Войти" loadingText="Logging in ..." />
                                </FormItem>
                            </Center>
                        </Form>
                    </Col>
                </Row>
            </div>
        );                 
    }
}
export default Form.create()(LoginForm);