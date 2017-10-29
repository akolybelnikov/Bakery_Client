import React, { Component } from "react";
import { Row, Col } from 'antd';
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
  <a href='{{link}}' target='_blank' class='instafeed__item'>
    <div class="tile is-child">
      <img class='instafeed__item__background' src='{{image}}' />
    </div>
  </a>
`

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
    const instafeedTarget = 'instafeed';    
    return (
      <div className="columns">
        <div className="column is-hidden-mobile">
          <div className="tile is-ancestor">
            <div className="tile is-parent is-12" id={instafeedTarget}>
                <Instafeed
                  limit='6'
                  resolution='thumbnail'
                  sortBy='most-recent'
                  template={Template}
                  userId={`${config.instagram.REACT_APP_INSTAGRAM_USER_ID}`}
                  clientId={`${config.instagram.REACT_APP_INSTAGRAM_CLIENT_ID}`}
                  accessToken={`${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`}
                />
            </div>
          </div>
        </div>
        <div className="column">  
            <Background height={this.state.windowHeight} src={this.state.image} placeholder={bgImg} transition="all 1s linear"><Center>Let's try to put sme text in here</Center></Background>
        </div>
      </div>
    );
  }
}