import React from "react";
import { Link } from "react-router-dom";
import { Table, Icon, Breadcrumb, Row } from 'antd';
import styled from 'styled-components';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import ProgressiveImage from 'react-progressive-bg-image';
import "./Admin.css";

const bgImg = require(`../../public/logo.png`);

const BreadCrumbs = styled(Row)`
    margin-top: 50px;
`;

const IconRow = styled(Row)`
    margin-top: 50px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 50px;
    }
`;

const Image = styled(ProgressiveImage)`
    height: 100px;
    width: 100px;
    background-size: cover;
    background-position: center center;
`;

const columns = [{
    title: 'Выберите продукт',
    dataIndex: 'image',
    key: 'image',
    render: image => <Image placeholder={bgImg} src={`${config.s3.URL}/100x100/${image}`} transition="all 1s linear"/>
}, {
    title: 'Название',
    dataIndex: 'productName',
    key: 'productName',
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

    handleClick = event => {
        event.preventDefault();
        this.props.history.push('/admin');
    }

    render() {
        return (
            <div>
                <IconRow className="is-hidden-desktop">
                    <Icon onClick={this.handleClick} className="icon-back" type="left" />
                </IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link style={{fontSize: 17}} to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link style={{fontSize: 17}} to='#' className="active-link">{this.props.match.params.category === "bread" ? "Хлеб и булки" : this.props.match.params.category === "coffee" ?  "Кофе и другие напитки" : this.props.match.params.category === "cakes" ? "Кондитерские изделия" : this.props.match.params.category === "order" ? "Торты на заказ" : "Новости"}</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row style={{marginTop: '20px'}}>
                    {this.state.products && this.renderProducts(this.state.products)}
                </Row>
            </div>
        );
    }

}