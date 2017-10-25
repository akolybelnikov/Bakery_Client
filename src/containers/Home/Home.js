import React, { Component } from "react";
import { Row, Col } from 'antd';
import Center from 'react-center';
import ProcessImage from 'react-imgpro';
import "./Home.css";
const bgImg = require(`./bg.jpg`);
const divStyle = {
  backgroundImage: `url(${bgImg})`, 
  backgroundSize: "cover",
  
}; 




export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      err: null,
      image: 'https://source.unsplash.com/eEKgcdGZhzs'
    }
  }  

  render() {
    return (
      <Row>
        <Col className="is-hidden-mobile" sm={17}>
          <div className="Home">    
            <Center>
              <div className="lander">
                <h1>Main page</h1>
                <p>This is the lander.</p>
              </div>
            </Center>           
          </div>
        </Col>
        <Col sm={6}>
          <figure>
            <ProcessImage image={this.state.image} resize={{ width: 500, height: 800, mode: 'bilinear' }} processedImage={(src, err) => this.setState({ src, err, })}
          />    
          </figure>
        </Col>
      </Row>
    );
  }
}