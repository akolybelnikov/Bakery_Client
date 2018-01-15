import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon, Spin } from 'antd';
import "./Categories.css";
import Responsive from 'react-responsive';
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import { invokeOpenApi } from "../../libs/awsLib";
import config from "../../config";

const Tablet = props => <Responsive {...props} maxWidth={768} />;
const Desktop = props => <Responsive {...props} minWidth={769} />;

const bounceAnimation = keyframes`${bounceIn}`;

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const BreadCrumbs = styled(Row)`
    color: #331507;
    margin-top: 35px;
`;

const CategoriesRow = styled(Row)`
    margin: 3% 0;
    @media only screen and (max-width: 768px) {
        margin-bottom: 10%;
    }
`;

const CategoryCard = styled(Col)`
    animation: 1s ${bounceAnimation};
    padding: 10px;
    cursor: pointer;
`;
const Image = styled(ProgressiveImage)`
    height: 450px;
    background-size: cover;
    background-position: center center;
    @media only screen and (min-width: 668px) and (max-width: 768px) {
        height: 300px;
    }
    @media only screen and (max-width: 667px) {
        height: 250px;
    }
`;

const bread = require(`../../public/tiny_bread.png`);
const coffee = require(`../../public/tiny_coffee.png`);
const cakes = require(`../../public/tiny_cakes.png`);
const order = require(`../../public/tiny_order.png`);

export default class Categories extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            categories: []
        }
    }

    async componentDidMount() {
      
        try {
          const results = await this.categories();
          this.setState({ categories: results });
        } catch (e) {
          console.log(e);
        }
      
        this.setState({ loading: false });
    }
    
    categories() {
        return invokeOpenApi({ path: "/categories"});
    }

    handleCategoryClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    handleClick = event => {
        event.preventDefault();
        this.props.history.push('/');
    }

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <CategoryCard key={category.categoryId} xs={24} sm={12}>
                <Card
                    href={`/products/${category.categoryName}`}
                    onClick={this.handleCategoryClick}
                    title={category.title}>
                    <Tablet>
                        <Image placeholder={category.categoryName === 'bread' ? bread : category.categoryName === 'coffee' ? coffee : category.categoryName === 'cakes' ? cakes : order} src={`${config.s3.URL}/300x300/${category.image}`} transition="all 2s linear"/>
                    </Tablet>
                    <Desktop>
                        <Image placeholder={category.categoryName === 'bread' ? bread : category.categoryName === 'coffee' ? coffee : category.categoryName === 'cakes' ? cakes : order} src={`${config.s3.URL}/450x450/${category.image}`} transition="all 2s linear"/>
                    </Desktop>
                </Card>
            </CategoryCard>
        )
    }

    render() {
        return (
           <div>
                <IconRow className="is-hidden-tablet"><Icon onClick={this.handleClick} className="icon-back" type="left" /></IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link className="active-link" to='#'>Ассортимент</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <CategoriesRow>
                    {this.state.categories ? this.renderCategories(this.state.categories) : <Spin style={{display: 'block', marginTop: '45px'}} size="large" />}
                </CategoriesRow>
           </div>
        );
    }

}

