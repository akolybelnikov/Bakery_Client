import React from "react";
import { Link } from "react-router-dom";
import { Table, Icon, Breadcrumb, Row } from 'antd';
import styled from 'styled-components';
import config from "../../config";
import { invokeOpenApi } from "../../libs/awsLib";
import ProgressiveImage from 'react-progressive-bg-image';
import "./Admin.css";

const bgImg = require(`../../public/logo-300.png`);

const BreadCrumbs = styled(Row)`
    margin-top: 35px;
`;

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const Image = styled(ProgressiveImage)`
    height: 100px;
    width: 100px;
    background-size: cover;
    background-position: center center;
`;

const columns = [{
    title: 'Выберите новость.',
    dataIndex: 'image',
    key: 'image',
    render: image => <Image placeholder={bgImg} src={`${config.s3.URL}/100x100/${image}`} transition="all 1s linear"/>
}, {
    title: '',
    dataIndex: 'content',
    key: 'content',
}];

export default class NewsView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            news: []
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getNews();
            this.assignKeys(results); 
            this.setState({
                news: results,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getNews() {
        return invokeOpenApi({ path: `/news` });
    }

    assignKeys(news) {
        for (let item of news) {
            item.key  = item.newsId
        }
    }

    renderNews(news) {
        return <Table columns={columns} dataSource={news} rowSelection={this.rowSelection} />;
    }

    rowSelection = {
        onChange: (selectedRowKeys) => {
            this.props.history.push(`/admin/news/${selectedRowKeys}`);
        }
    };

    render() {
        return (
            <div style={{height: '100vh'}}>
                <IconRow className="is-hidden-desktop">
                    <Icon onClick={this.props.history.goBack} className="icon-back" type="left" />
                </IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/admin">Управление</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to='#' className="active-link">Новости</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row style={{marginTop: "20px"}}>
                    {this.state.news && this.renderNews(this.state.news)}
                </Row>
            </div>
        );
    }

}