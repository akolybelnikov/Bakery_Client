import React, { Component } from "react";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input, Row, Col, notification } from 'antd';
import config from "../../config";
import LoaderButton from "../../components/LoaderButton";
import "./LoginForm.css";

const FormItem = Form.Item;   

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
          userName: '',
          password: '',
          loading: false,
        };
    }

    validateForm() {    
        return this.state.userName.length > 0 && this.state.password.length > 0;  
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

    handleUsernameChange = (e) => {
        this.setState({
            userName: e.target.value
        });
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        try {
            await this.login(this.state.userName, this.state.password);                    
            this.props.userHasAuthenticated(true);
            this.props.history.push('/admin');

        } catch (e) {
            this.setState({ 
                loading: false,
                userName: '',
                password: ''
            });
        }  
    }

    render() {

        return (
            <div style={{height: '70vh'}}>
                <Row style={{marginTop: '25vh'}}>
                    <Col xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="email" placeholder="Пользователь" value={this.state.userName} onChange={this.handleUsernameChange} autoFocus/>
                            </FormItem>
                            <FormItem>
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Пароль" value={this.state.password} onChange={this.handlePasswordChange} />
                            </FormItem>
                            <FormItem style={{textAlign: "center"}}>
                                <LoaderButton style={{width: '200px'}} id='login-button' type="primary" htmlType="submit" loading={this.state.loading} text="Войти" disabled={!this.validateForm()} loadingText="Выполняется вход ..." />
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        );                 
    }
}