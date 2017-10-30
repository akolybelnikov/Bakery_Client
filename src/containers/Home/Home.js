import React, { Component } from "react";
import { Row, Col, Card } from 'antd';
import Center from 'react-center';
import "./Home.css";
import styled from 'styled-components';
import ProgressiveImage from 'react-progressive-bg-image';
import Instafeed from 'react-instafeed';
import config from "../../config";

const bgImg = require(`./bg.jpg`);

const Background = styled(ProgressiveImage).attrs({
  height: props => props.height
})`
  background-color: pink;
  background-size: cover;
  background-position: center center;
  min-height: ${props => props.height}px;
`;

const Template = ` 
  <div class="ant-col-xs-3 ant-col-sm-6">    
    <a href='{{link}}' target='_blank' class='instafeed__item'>
      <img class='instafeed__item__background' src='{{image}}' style="padding-right: 5px;"/>
    </a>
  </div>
`

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: 'https://source.unsplash.com/eEKgcdGZhzs/500x750',
      windowHeight: this.props.windowHeight
    }
  }

  onSuccess(object) {
    console.log(this.instafeed);
  }

  componentDidMount() {
    console.log(this.instafeed.props.children);
  }

  render() {   
    return (
      <Row>
        <Col sm={14}>
            <Card title="Instagram" bordered="false">
              <Row gutter={16} type="flex" justify="start" ref={instafeed => this.instafeed = instafeed} id='instafeed'>              
                <Instafeed
                  limit='8'
                  resolution='thumbnail'
                  sortBy='most-recent'
                  template={Template}
                  userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                  clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                  accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
                  success={this.onSuccess(Instafeed)}
                />  
              </Row>
            </Card>
            <Card title="News">     
                <Card.Grid>news 1</Card.Grid>
                <Card.Grid>news 2</Card.Grid>
                <Card.Grid>news3</Card.Grid>
                <Card.Grid>news4</Card.Grid>
                <Card.Grid>news5</Card.Grid>
                <Card.Grid>news6</Card.Grid>    
            </Card>
        </Col>
        <Col sm={10}>  
            <Background height={this.state.windowHeight} src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></Background>
        </Col>
      </Row>
    );
  }
}