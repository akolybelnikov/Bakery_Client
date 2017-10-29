import React, { Component } from "react";
import { Form, Icon, Input, Button } from 'antd';
import Center from 'react-center';
import LoaderButton from "../../components/LoaderButton";
import styled from 'styled-components';

const FormItem = Form.Item;   

const SignupForm = styled.div`
    padding: 100px 0;
`

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Signup extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            loading: false,
            newUser: null
        };
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        this.setState({ newUser: "test" });
        
        this.setState({ loading: false });

        this.props.form.resetFields();

        this.props.form.validateFields();
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();
    
        this.setState({ isLoading: true });

        this.props.form.validateFields();
    }

    renderConfirmationForm() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const confirmationCodeError = isFieldTouched('confirmationCode') && getFieldError('confirmationCode');
        return(
            <div>
                <Center><p className="is-size-4 has-text-dark title Admin">Confirmation</p></Center>
                <Center>
                    <div className="Form">
                        <Form onSubmit={this.handleConfirmationSubmit}>
                            <FormItem validateStatus={confirmationCodeError ? 'error' : ''} help={confirmationCodeError || ''}>
                                {getFieldDecorator('confirmationCode', {
                                    rules: [{ required: true, message: 'Please provide the code you received in the confirmation email' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="Confirmation Code" autoFocus/>
                                )}
                            </FormItem>
                            <FormItem>
                                <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Verify" loadingText="Verifying ..." />
                            </FormItem>
                        </Form>
                    </div>
                </Center>
            </div>
        )
    }

    renderForm() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Show errors only if a field was touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const confirmPasswordError = isFieldTouched('confirmPassword') && getFieldError('confirmPassword');
        return (
            <div>
                <Center><p className="is-size-4 has-text-dark title Admin">Signup</p></Center>
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
                            <FormItem validateStatus={confirmPasswordError ? 'error' : ''} help={confirmPasswordError || ''}>
                                {getFieldDecorator('confirmPassword', {
                                    rules: [{ required: true, message: 'Please confirm your password' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Confirm password" />
                                )}
                            </FormItem>
                            <FormItem>
                                <LoaderButton type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading} text="Signup" loadingText="Signing up ..." />
                            </FormItem>
                        </Form>
                    </div>
                </Center>
            </div>
        );
    }

    render() {
        return (
            <SignupForm>
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </SignupForm>
        )
    }
}

export default Form.create()(Signup);