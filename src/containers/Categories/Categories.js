import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Breadcrumb } from 'antd';
import "./Categories.css";
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import { invokeOpenApi } from "../../libs/awsLib";

const bounceAnimation = keyframes`${bounceIn}`;

const BreadCrumbs = styled(Row)`
    margin: 0;
    color: #331507
`

const CategoryCard = styled(Col)`
    animation: 1.5s ${bounceAnimation};
    padding: 10px;
`
const Image = styled(ProgressiveImage)`
    min-height: 300px;
    background-size: cover;
    background-position: center center;
`
const bgImg = require(`../../public/bg.jpg`);

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

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <CategoryCard key={category.categoryId} xs={24} sm={12}>
                <Card
                    href={`/products/${category.categoryName}`}
                    onClick={this.handleCategoryClick}
                    title={category.title}
                    ><Image placeholder={bgImg} src={category.attachment} transition="all 1s linear"/>
                </Card>
            </CategoryCard>
        )
    }

    render() {
        return (
           <div>
                <BreadCrumbs>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>Ассортимент</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <Row>
                    {this.state.categories && this.renderCategories(this.state.categories)}
                </Row>
           </div>
        );
    }

}

