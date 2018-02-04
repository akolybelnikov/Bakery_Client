import React from "react";
import { withRouter } from "react-router-dom";
import { Input, List, Row, Col, message, Modal } from 'antd';
import styled from "styled-components";
import { invokeOpenApi } from "../libs/awsLib";
import config from "../config";
import Responsive from 'react-responsive';

const Mobile = props => <Responsive {...props} maxWidth={768} />;
const Desktop = props => <Responsive {...props} minWidth={769} />;


const Search = Input.Search;
const listData = [];

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

`

class SearchModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            products: [],
            disabled: false,
            modalVisible: false,
            mobileModalVisible: false
        };
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }

    setMobileModalVisible(mobileModalVisible) {
        this.setState({ mobileModalVisible });
        this.props.setMobileSearchModalVisible();
        this.setState({searchValue: ''});
      }

    handleChange = (e) => {
        this.setState({searchValue: e.target.value});
    }

    getBread() {
        return invokeOpenApi({ path: `/categories/bread` });
    }

    getCoffee() {
        return invokeOpenApi({ path: `/categories/coffee` });
    }

    getCakes() {
        return invokeOpenApi({ path: `/categories/cakes` });
    }

    getOrder() {
        return invokeOpenApi({ path: `/categories/order` });
    }

    handleProductClick = (e) => {
        e.preventDefault();
        this.props.history.push(e.currentTarget.getAttribute("href"));
        this.setState({ modalVisible: false });
        listData.splice(0);
        this.setState({disabled: false});
    }

    async handleSearch(value) {

        const products = [];

        if (value !== "") {
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
    
            for (let product of this.state.products) {
                if (product.productName.toLowerCase().match(value.toLowerCase()) || product.content.toLowerCase().match(value.toLowerCase())) {
                    listData.push(product);
                }
            }
            
            if (listData.length > 0) {
    
                this.setModalVisible(true);
    
            } else {
                message.error('Наименований не найдено! Попробуйте изменить условия поиска.', 3);
            }
        } else {
            message.error('Наименований не найдено! Попробуйте изменить условия поиска.', 3);
        }

        this.setState({searchValue: ''});
        this.props.setMobileSearchModalVisible();
    }

    render() {
        return (
        <div>
            <Mobile>
                <MobileModal
                    style={{ top: 20 }}
                    visible={this.props.mobileModalVisible}
                    onOk={() => this.handleSearch(this.state.value) }
                    onCancel={() => this.setMobileModalVisible(false)}>
                    <InputSearch style={{ top: 20, left: 20}} disabled={this.state.disabled} value={this.state.searchValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>
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
                                    <List.Item style={{background: 'white', cursor: 'pointer', padding: 20}}
                                        href={`/products/${item.category}/${item.productId}`}
                                        onClick={this.handleProductClick}
                                        key={item.productId}
                                        actions={[<p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{item.weight}</p>, <p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{item.price} руб.</p>]}>
                                        <List.Item.Meta
                                        title={item.productName} />
                                        <Row>
                                            <Col xs={16}>{item.content}</Col>
                                            <Col xs={8}><img alt="" src={`${config.s3.URL}/100x1000/${item.image}`} /></Col>
                                        </Row>
                                    </List.Item>
                                )} />
                        </StyledModal>
                    </Col>
                </Row>
            </Mobile>

            <Desktop>
                <InputSearch style={{ top: 40, left: 20}} disabled={this.state.disabled} value={this.state.searchValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>

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
                            <List.Item style={{background: 'white', cursor: 'pointer', padding: 20}}
                                href={`/products/${item.category}/${item.productId}`}
                                onClick={this.handleProductClick}
                                key={item.productId}
                                actions={[<p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{item.weight}</p>, <p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{item.price} руб.</p>]}>
                                <List.Item.Meta
                                title={item.productName} />
                                <Row>
                                    <Col xs={16}>{item.content}</Col>
                                    <Col xs={8}><img alt="" src={`${config.s3.URL}/150x150/${item.image}`} /></Col>
                                </Row>
                            </List.Item>
                        )} />
                </StyledModal>
            </Desktop>
        </div>
        );
    }
}

export default withRouter(SearchModal);