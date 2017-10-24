import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, Row, Col, Affix } from 'antd';
import './App.css';
const logo = require(`./mstile-150x150.png`);
const { Header, Footer, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
            <Header className="header">
              <div className="logo"><img className="image is-64x64" src={logo} alt="logo"/></div> 
              <Menu className="is-hidden-mobile"
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px', color: '#E3BF3F' }}>
                <Menu.Item key="1">Coffee</Menu.Item>
                <Menu.Item key ="2">Bread</Menu.Item>
                <Menu.Item key="3">Cakes</Menu.Item>
                <Menu.Item key="4">Order</Menu.Item>
                <Menu.Item key="5">About Us</Menu.Item>
                <Menu.Item key="6">Contact</Menu.Item>
              </Menu>    
            </Header>
            <Layout>
              <Sider className="is-hidden-tablet" breakpoint="xl" collapsedWidth="0" onCollapse={(collapsed, type) => { console.log(collapsed, type); }}>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1"><Icon type="coffee" />Coffee</Menu.Item>
                  <Menu.Item key="2"><Icon type="shop" />Bread</Menu.Item>
                  <Menu.Item key="3"><Icon type="gift" />Cakes</Menu.Item>
                  <Menu.Item key="4"><Icon type="shopping-cart" />Order</Menu.Item>
                  <Menu.Item key="5"><Icon type="trademark" />About Us</Menu.Item>
                  <Menu.Item key="6"><Icon type="mail" />Contact</Menu.Item>
                </Menu>
              </Sider>
              <Layout>
                <Content>
                  <div className="scrollable-container" ref={(node => { this.container = node; })}>               Content
                    <Button type="primary">Content</Button>
                    <Affix target={ () => this.container} style={{ position: 'absolute', top: 70, right: 5}}>
                      <Button type="primary" className="is-pulled-right is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
                    </Affix>
                  </div>
                </Content>
                <Footer>Footer</Footer>
              </Layout>
           </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
