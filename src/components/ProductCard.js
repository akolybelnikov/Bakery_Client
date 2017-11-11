import React from "react";
import { Card, Col } from 'antd';
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';

const ProductCard = ({product}) => {
    const handleProductClick = (event) => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    };

    return (
        <Col xs={12} sm={12} xl={6}>
            <Card
            key={product.productId}
            href={`/${product.category}/${product.productId}`}
            onClick={handleProductClick}
            title={product.productName}
            ><div><img src={product.attachment} /></div>
            <div>{product.price}</div>
            </Card>
        </Col>
    );
};

export default ProductCard;