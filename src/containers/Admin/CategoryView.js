import React from "react";
import { Link } from "react-router-dom";
import { Table, Icon, Divider, Breadcrumb, Row } from 'antd';
import styled from 'styled-components';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import ProgressiveImage from 'react-progressive-bg-image';
import "./Admin.css";

const bgImg = require(`../../public/bg.jpg`);

const BreadCrumbs = styled(Row)`
    margin-top: 35px;
`;

const Image = styled(ProgressiveImage)`
    height: 100px;
    width: 100px;
    background-size: cover;
    background-position: center center;
`;

const columns = [{
    title: '',
    dataIndex: 'image',
    key: 'image',
    render: image => <Image placeholder={bgImg} src={`${config.s3.URL}/100x100/${image}`} transition="all 1s linear"/>
}, {
    title: 'Название',
    dataIndex: 'productName',
    key: 'productName',
} , {
    title: 'Описание',
    dataIndex: 'content',
    key: 'content'
} , {
    title: 'Цена',
    dataIndex: 'price',
    key: 'price',
    render: text => <div>{text} руб.</div>
} , {
    title: 'Вес',
    dataIndex: 'weight',
    key: 'weight'
}];




export default class CategoryView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            products: []
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getProducts();
            this.assignKeys(results); 
            this.setState({
                products: results,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getProducts() {
        return invokeOpenApi({ path: `/categories/${this.props.match.params.category}` });
    }

    assignKeys(products) {
        for (let product of products) {
            product.key  = product.productId
        }
    }

    renderProducts(products) {
        return <Table columns={columns} dataSource={products} rowSelection={this.rowSelection} />;
    }

    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.props.history.push(`/admin/${this.props.match.params.category}/${selectedRowKeys}`);
        }
    };

    render() {
        return (
            <div>
                <Row className="is-hidden-tablet" style={{marginTop: "10px"}}>
                    <Icon onClick={this.props.history.goBack} className="icon-back" type="left" />
                </Row>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : this.props.match.params.category === "order" ? "Торты на заказ" : "Новости"}</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row style={{marginTop: "20px"}}>
                    <p style={{color: "#331507"}} className="is-size-7-mobile is-size-6-tablet">Выберите продукт.</p>
                    {this.state.products && this.renderProducts(this.state.products)}
                </Row>
            </div>
        );
    }

}