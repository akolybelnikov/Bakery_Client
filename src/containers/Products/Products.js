import React, { Component } from "react";
import { Row, Col, Card, Icon } from 'antd';
import Center from 'react-center';
import "./Products.css";
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import ProgressiveImage from 'react-progressive-bg-image';
import { listAll, invokeApig } from "../../libs/awsLib";
import config from "../../config";

const bounceAnimation = keyframes`${bounceIn}`;

const CategoryCard = styled(Col)`
    animation: 2s ${bounceAnimation};
`

export default class Products extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            categories: [
                {id: 1, title: 'Хлеб и Булки', image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/bread.jpg', placeholder: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/bread-small.jpg'}, 
                {id: 2, title: 'Кофе и другие напитки', image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/coffee.jpg', placeholder: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/coffee-small.jpg'},
                {id: 3, title: 'Кондитерские изделия', image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/cakes.jpg', placeholder: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/cakes-small.jpg'}, 
                {id: 4, title: 'Торты на заказ', image: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/order.jpg', placeholder: 'https://s3.eu-central-1.amazonaws.com/bakery-uploads/order-small.jpg'}
            ],
            products: []
        }
    }

    async componentDidMount() {
      
        try {
          const results = await this.products();
          this.setState({ products: results });
        } catch (e) {
          console.log(e);
        }
      
        this.setState({ isLoading: false });
    }
    
    products() {
        return invokeApig({ path: "/categories"});
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
                    href={`/categories/${category.id}`}
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

