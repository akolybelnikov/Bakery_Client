import React, { Component } from "react";
import { Row, Col, Card, Icon } from 'antd';
import Center from 'react-center';
import "./Products.css";
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';

const bounceAnimation = keyframes`${bounceIn}`;

const CategoryCard = styled(Col)`
    animation: 2s ${bounceAnimation};
`

const breadImage = require(`./bread.jpg`);
const breadPlaceholder = require(`./bread-small.jpg`);
const coffeeImage = require(`./coffee.jpg`);
const coffeePlaceholder = require(`./coffee-small.jpg`);
const cakesImage = require(`./cakes.jpg`);
const cakesPlaceholder = require(`./cakes-small.jpg`);
const orderImage = require(`./order.jpg`);
const orderPlaceholder = require(`./order-small.jpg`);

export default class Products extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            categories: [
                {id: 1, title: 'Хлеб и Булки', image: breadImage, placeholder: breadPlaceholder}, 
                {id: 2, title: 'Кофе и другие напитки', image: coffeeImage, placeholder: coffeePlaceholder}, 
                {id: 3, title: 'Кондитерские изделия', image: cakesImage, placeholder: cakesPlaceholder}, 
                {id: 4, title: 'Торты на заказ', image: orderImage, placeholder: orderPlaceholder}]
        }
    }

    handleCategoryClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <CategoryCard key={category.id} xs={24} sm={12} xl={6}>
                <Card
                    href={`/products/${category.id}`}
                    onClick={this.handleCategoryClick}
                    title={category.title}
                    ><img style={{}} src={category.image} />
                </Card>
            </CategoryCard>
        )
    }

    render() {
        return (
            <Row>
               {this.renderCategories(this.state.categories)}
            </Row>
        );
    }

}

