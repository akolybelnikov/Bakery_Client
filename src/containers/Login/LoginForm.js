import React, { Component } from "react";
import { Form, Icon, Input, Button } from 'antd';
import Center from 'react-center';
import "./LoginForm.css";
const FormItem = Form.Item;   

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
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