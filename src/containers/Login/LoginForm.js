import React, { Component } from "react";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input, Button } from 'antd';
import Center from 'react-center';
import config from "../../config";
import "./LoginForm.css";

const FormItem = Form.Item;   

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          isLoading: false,
          email: "",
          password: ""
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
                onFailure: err => {reject(err); alert(err.message)}
            })
        );
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.login(values['userName'], values['password']);       
                  }
            })
        } catch (e) {
            alert(e);
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
            <Center>
                <div className="form">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please provide your email!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="email" placeholder="Username" autoFocus/>
                            )}
                        </FormItem>
                        <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please provide your password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>Log in</Button>
                        </FormItem>
                    </Form>
                </div>
            </Center>
        );
    }
}
export default Form.create()(LoginForm);