import React, { Component } from "react";
import { Row, Col } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';

const bgImg = require(`./bg.jpg`);
const StyledProgressiveImage = styled(ProgressiveImage)`
  height: 100%;
  background-size: contain;
  background-position: center center;
`;

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      err: null,
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750'
    }
  }  

  render() {
    return (
      <Row>
        <Col className="" sm={17}>
          <div className="Home">    
            <Center>
              <div className="lander">
                <StyledProgressiveImage src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></StyledProgressiveImage>          
              </div>
            </Center>           
          </div>
        </Col>
        <Col sm={6}>
         
        </Col>
      </Row>
    );
  }
}