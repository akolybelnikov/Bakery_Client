import React, { Component } from "react";
import { Row, Col } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';

const bgImg = require(`./bg.jpg`);
const Background = styled(ProgressiveImage)`
  height: 100%;
  background-color: pink;
  background-size: contain;
  background-position: center center;
`;
const Instafeed = styled.div`
  background-color: white;
`;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      err: null,
      image: 'https://source.unsplash.com/eEKgcdGZhzs/850x1350'
    }
  }  

  render() {
    return (
      <Row>
        <Col className="is-hidden-mobile" sm={6}></Col>
        <Col className="is-hidden-mobile" sm={6}></Col>
        <Col className="" xs={24} sm={12}>   
          <Center>   
              <Background src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></Background>          
          </Center>           
        </Col>
      </Row>
    );
  }
}