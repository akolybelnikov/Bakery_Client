import React, { Component } from "react";
import { Row } from 'antd';
import Center from 'react-center';
import ProductCard from "../../components/ProductCard";

export default class Coffee extends Component {
    render() {
      return (
        <Row>
          <Center>
            <div className="Coffee">
              <h1>Coffee</h1>
              <p>All coffee products come here</p>
            </div>
          </Center>
        </Row>
      );
    }
}