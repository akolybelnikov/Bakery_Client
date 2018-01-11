import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb, Icon, Spin } from 'antd';
import "./Categories.css";
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import { invokeOpenApi } from "../../libs/awsLib";
import config from "../../config";

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
`;

const CategoryCard = styled(Col)`
    animation: 1s ${bounceAnimation};
    padding: 10px;
    cursor: pointer;
`;
const Image = styled(ProgressiveImage)`
    min-height: 500px;
    background-size: cover;
    background-position: center center;
    @media only screen and (min-width: 321px) and (max-width: 768px) {
        min-height: 300px;
    }
    @media only screen and (max-width: 320px) {
        min-height: 250px;
    }
`;

const bread = require(`../../public/categories/bread.jpg`);
const coffee = require(`../../public/categories/coffee.jpg`);
const cakes = require(`../../public/categories/cakes.jpg`);
const order = require(`../../public/categories/order.jpg`);

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
            <CategoryCard key={category.categoryId} xs={24} md={12}>
                <Card
                    href={`/products/${category.categoryName}`}
                    onClick={this.handleCategoryClick}
                    title={category.title}
                    ><Image placeholder={category.categoryName === 'bread' ? bread : category.categoryName === 'coffee' ? coffee : category.categoryName === 'cakes' ? cakes : order} src={`${config.s3.URL}/500x500/${category.image}`} transition="all 2s linear"/>
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

