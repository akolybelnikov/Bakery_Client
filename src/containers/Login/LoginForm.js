import React, { Component } from "react";
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { Form, Icon, Input } from 'antd';
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

        this.setState({ loading: true });

        try {
            await this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.login(values['userName'], values['password']);  
                    this.props.userHasAuthenticated(true);
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

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div>
                <Center><p className="is-size-4 has-text-dark title Admin">Login</p></Center>
                <Center>
                    <div className="Form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: 'Please provide your email' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="email" placeholder="Username" autoFocus/>
                                )}
                            </FormItem>
                            <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please provide your password' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                                )}
                            </FormItem>
                            <FormItem>
                                <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Login" loadingText="Logging in ..." />
                            </FormItem>
                        </Form>
                    </div>
                </Center>
            </div>
        );
    }
}
export default Form.create()(LoginForm);