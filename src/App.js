import React, { Component } from 'react';
import { Layout } from 'antd';
import { Row, Col } from 'antd';
import Button from 'antd/lib/button';
import './App.css';
const logo = require(`./mstile-150x150.png`);
const { Header, Footer, Content } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Header id="Header">
            <div>
              <Row>
                <Col xs={24} sm={24} md={5} lg={8}>   
                <a id="Logo">
                  <img src={logo} alt="logo"/>
                </a>         
                  <p className="Telephone">Tel. 8 (095) 124-53-67, <span className="Address">Moscow, Berezhnyi pr-d, 167</span></p>
                </Col>
              </Row>
            </div>
          </Header>
          <Content>
            <p>Content</p>        
            <Button type="default" size="large">Our Assortment</Button>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
