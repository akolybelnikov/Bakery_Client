import React, { Component } from "react";
import { Row, Col } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';

const bgImg = require(`./bg.jpg`);

const Background = styled(ProgressiveImage).attrs({
  height: props => props.height
})`
  background-color: pink;
  background-size: cover;
  background-position: center center;
  min-height: ${props => props.height}px;
`;

const feed = new Instafeed({
  get: 'tagged',
  tagName: 'awesome',
  clientId: 'baf04cdf77e041f387e8d758920c9e22'
});

feed.run();

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.state = {
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750',
      windowHeight: this.props.windowHeight
    }
  }

  componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
      this.setState({ windowHeight: window.innerHeight - 103 });
  }

  render() {
    return (
      <Row>
        <Col className="is-hidden-mobile" sm={12}><div id="instafeed"></div></Col>
        <Col className="" xs={24} sm={12}>  
            <Background height={this.state.windowHeight} src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></Background>
        </Col>
      </Row>
    );
  }
}