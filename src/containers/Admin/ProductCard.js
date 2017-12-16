import React from "react";
import { Card, Col } from 'antd';

const ProductCard = ({product}) => {
    const handleProductClick = (event) => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    };

    return (
        <Col xs={12} sm={12} xl={6}>
            <Card
                key={product.productId}
                href={`/products/${product.productId}`}
                onClick={handleProductClick}
                title={product.productName}
                ><div><img alt="product" src={product.attachment} /></div>
                <div>{product.price}</div>
            </Card>
        </Col>
    );
};

export default ProductCard;