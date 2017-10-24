import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, Row, Col } from 'antd';
import './App.css';
const logo = require(`./mstile-150x150.png`);
const { Header, Footer, Content } = Layout;

class App extends Component {
  state = {
    collapsed: true,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <div className="App">
        <Layout>
          <Header id="Header">
            <div>
              <Row>
                <Col xs={6} sm={6} md={2} lg={2}>
                  <figure className="image is-64x64 Logo">
                    <img src={logo} alt="logo"/>
                  </figure> 
                  <span className="Slogan">Vse Bulki Tut</span>
                </Col>
                <Col xs={18} sm={18} md={22} lg={22} className="is-hidden-tablet"> 
                  <div style={{ width: 240 }}>
                  <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                  </Button>
                  <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline"       theme="dark" inlineCollapsed={this.state.collapsed}>
                    <Menu.Item>
                      <Icon type="coffee" />
                      <span>Coffee</span>
                    </Menu.Item>
                    <Menu.Item>
                      <Icon type="shop" />
                      <span>Bread</span>
                    </Menu.Item>
                    <Menu.Item>
                      <Icon type="gift" />
                      <span>Cakes</span>
                    </Menu.Item>
                  </Menu>
                  </div>
                </Col>
              </Row>
              <p className="Telephone">Tel. 8 (095) 124-53-67, <span className="Address">Moscow, Berezhnyi pr-d, 167</span></p>
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
