import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Layout, Menu, Icon, Button, Affix } from 'antd';
import './App.css';
import Routes from "./Routes";
import Center from 'react-center';
const logo = require(`./mstile-150x150.png`);
const { Header, Footer, Content, Sider } = Layout;

class App extends Component {

  state = {
    current: '0',
  }

  handleLogoClick = (e) => {
    this.setState({
      current: "0"
    });
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <div className="App">
        <Layout>
            <Header className="header">
              <NavLink onClick={this.handleLogoClick} to="/"><div className="logo"><img className="image is-64x64" src={logo} alt="logo"/></div></NavLink> 
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} className="is-hidden-mobile Menu" theme="light" mode="horizontal" style={{ lineHeight: '64px' }}>
                <Menu.Item key="1"><NavLink to="/coffee">Coffee</NavLink></Menu.Item>
                <Menu.Item key ="2"><NavLink to="/coffee">Bread</NavLink></Menu.Item>
                <Menu.Item key="3"><NavLink to="/cakes">Cakes</NavLink></Menu.Item>
                <Menu.Item key="4"><NavLink to="/coffee">Order</NavLink></Menu.Item>
                <Menu.Item key="5"><NavLink to="/coffee">About Us</NavLink></Menu.Item>
                <Menu.Item key="6"><NavLink to="/coffee">Contact</NavLink></Menu.Item>
              </Menu>  
            </Header>
            <Layout>
              <Sider className="is-hidden-tablet" breakpoint="xl" collapsedWidth="0">
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} theme="light" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1"><NavLink to="/coffee"><Icon type="coffee" />Coffee</NavLink></Menu.Item>
                  <Menu.Item key="2"><NavLink to="/coffee"><Icon type="shop" />Bread</NavLink></Menu.Item>
                  <Menu.Item key="3"><NavLink to="/cakes"><Icon type="gift" />Cakes</NavLink></Menu.Item>
                  <Menu.Item key="4"><NavLink to="/coffee"><Icon type="shopping-cart" />Order</NavLink></Menu.Item>
                  <Menu.Item key="5"><NavLink to="/coffee"><Icon type="trademark" />About Us</NavLink></Menu.Item>
                  <Menu.Item key="6"><NavLink to="/coffee"><Icon type="mail" />Contact</NavLink></Menu.Item>
                </Menu>
              </Sider>
              <Layout>
                <Content>     
                  <Affix style={{ position: 'absolute', top: 70, right: 5}}>
                    <Button type="primary" className="is-pulled-right is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
                  </Affix>
                  <Center><Routes /></Center>             
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
