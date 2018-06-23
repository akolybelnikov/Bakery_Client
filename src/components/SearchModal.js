import React from "react";
import { withRouter } from "react-router-dom";
import { Input, List, Row, Col, message, Modal } from 'antd';
import styled from "styled-components";
import { invokeOpenApi } from "../libs/awsLib";
import config from "../config";
import Responsive from 'react-responsive';
import Fuse from "fuse.js";

const Mobile = props => <Responsive {...props} maxWidth={768} />;
const Desktop = props => <Responsive {...props} minWidth={769} />;

const Wrap = styled.div`

`

const Search = Input.Search;
let listData = [];

const InputSearch = styled(Search)`
    [disabled] {
        border: none;
    }
`
const StyledModal = styled(Modal)`
    h4.ant-list-item-meta-title {
        color: rgba(82, 8, 45, 1);
    }
`

const MobileModal = styled(Modal)`
    top: 20;
    .ant-modal-body {
        min-height: 100px;
    }
    .ant-modal-footer {
        display: none;
    }
`

class SearchModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            products: [],
            disabled: false,
            modalVisible: false,
            mobileModalVisible: false
        };
    }

    async componentDidMount() {
        const products = [];
        try {
            const bread = await this.getBread();
            const coffee = await this.getCoffee();
            const cakes = await this.getCakes();
            const order = await this.getOrder();
            products.push(bread, coffee, cakes, order);
            const allProducts = products.reduce((a, b) => a.concat(b), []);
            this.setState({
                products: allProducts
            });
        } catch (e) {
            message.error(e, 5);
        }
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }

    setMobileModalVisible(mobileModalVisible) {
        this.setState({ mobileModalVisible });
        this.props.setMobileSearchModalVisible();
        this.setState({inputValue: ''});
      }

    handleChange = (e) => {
        this.setState({ inputValue: e.target.value, });     
    }

    getBread() {
        return invokeOpenApi({ path: `/categories/bread` })
    }

    getCoffee() {
        return invokeOpenApi({ path: `/categories/coffee` })
    }

    getCakes() {
        return invokeOpenApi({ path: `/categories/cakes` })
    }

    getOrder() {
        return invokeOpenApi({ path: `/categories/order` })
    }

    handleSearch() {

        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            keys: ['productName', 'content']
        }

        const fuse = new Fuse(this.state.products, options)
        const result = fuse.search(this.state.inputValue)

        if (result.length) {
            listData = result
            this.setModalVisible(true)
        } else {
            message.error('Наименований не найдено! Попробуйте изменить условия поиска.', 3)
        }

        this.setState({ inputValue: '' })
        this.props.setMobileSearchModalVisible()
    }

    render() {
        return (
        <Wrap>
            <Mobile>
                <MobileModal
                    visible={this.props.mobileModalVisible}
                    onOk={() => this.handleSearch(this.state.inputValue) }
                    onCancel={() => this.setMobileModalVisible(false)}>
                    <InputSearch style={{ top: 20, left: 20}} disabled={this.state.disabled} value={this.state.inputValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>
                </MobileModal>
                <Row>
                    <Col xs={{span: 22, offset: 1}} xl={24}>
                        <StyledModal
                            title="Результаты поиска по сайту:"
                            wrapClassName="vertical-center-modal"
                            visible={this.state.modalVisible}
                            onOk={() => {
                                this.setModalVisible(false);
                                listData.splice(0);
                            }}
                            onCancel={() => {
                                this.setModalVisible(false);
                                listData.splice(0);
                            }}>

                            <List
                                itemLayout="vertical"
                                size="large"
                                dataSource={listData}
                                renderItem={item => (
                                    <a  href={`/products/${item.category}/${item.productId}`} key={item.productId}>
                                    <List.Item style={{background: 'white', cursor: 'pointer', padding: 20}}
                                        actions={[<p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{item.weight}</p>, <p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{item.price} руб.</p>]}>
                                        <List.Item.Meta
                                        title={item.productName} />
                                        <Row>
                                            <Col xs={16}>{item.content}</Col>
                                            <Col xs={8}><img alt="" src={`${config.s3.URL}/100x100/${item.image}`} /></Col>
                                        </Row>
                                    </List.Item>
                                    </a>
                                )} />
                        </StyledModal>
                    </Col>
                </Row>
            </Mobile>

            <Desktop>
                <InputSearch style={{ top: 40, left: 20}} disabled={this.state.disabled} value={this.state.inputValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>

                <StyledModal
                    title="Результаты поиска по сайту:"
                    wrapClassName="vertical-center-modal"
                    visible={this.state.modalVisible}
                    onOk={() => {
                        this.setModalVisible(false);
                        listData.splice(0);
                    }}
                    onCancel={() => {
                        this.setModalVisible(false);
                        listData.splice(0);
                    }}>

                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={listData}
                        renderItem={item => (
                            <a key={item.productId} href={`/products/${item.category}/${item.productId}`}>
                            <List.Item style={{background: 'white', cursor: 'pointer', padding: 20}}
                                
                                actions={[<p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{item.weight}</p>, <p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{item.price} руб.</p>]}>
                                <List.Item.Meta
                                title={item.productName} />
                                <Row>
                                    <Col xs={16}>{item.content}</Col>
                                    <Col xs={8}><img alt="" src={`${config.s3.URL}/150x150/${item.image}`} /></Col>
                                </Row>
                            </List.Item>
                            </a>
                        )} />
                </StyledModal>
            </Desktop>
        </Wrap>
        );
    }
}

export default withRouter(SearchModal);