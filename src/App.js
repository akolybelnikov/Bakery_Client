import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Layout, Menu, Icon, Button, Affix, Row, Col } from 'antd';
import './App.css';
import Routes from "./Routes";
import styled from 'styled-components';
const logo = require(`./mstile-150x150.png`);
const { Header, Content, Sider } = Layout;
const Container = styled.div`
  max-width: 1010px;
  margin: 0 auto;
`;
const Level = styled.div`
  background-color: rgba(220, 44, 44, 0.15)
`;

class App extends Component {

  state = {
      current: '0',
      size: 'large'
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

  handleSizeChange = (e) => {
    this.setState({ size: e.target.value });
  }

  render() {
    const size = this.state.size;
    return (

        <Layout>
          <Sider style={{ overflow: 'visible', position: 'fixed', left: 10, zIndex: 20, top: 20 }} className="is-hidden-tablet" breakpoint="xl" collapsedWidth="0">
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} theme="light" mode="inline">
              <Menu.Item key="0"><NavLink to="/"><Icon type="home" />Home</NavLink></Menu.Item>
              <Menu.Item key="1"><NavLink to="/coffee"><Icon type="coffee" />Coffee</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to="/coffee"><Icon type="shop" />Bread</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to="/cakes"><Icon type="gift" />Cakes</NavLink></Menu.Item>
              <Menu.Item key="4"><NavLink to="/coffee"><Icon type="shopping-cart" />Order</NavLink></Menu.Item>
              <Menu.Item key="5"><NavLink to="/coffee"><Icon type="trademark" />About Us</NavLink></Menu.Item>
              <Menu.Item key="6"><NavLink to="/coffee"><Icon type="mail" />Contact</NavLink></Menu.Item>
              <Menu.Item key="7"><NavLink to="/login"><Icon type="user" />Login</NavLink></Menu.Item>
            </Menu>
          </Sider>
            
          <Layout>
            <Header className="header">
              <Container>
                <NavLink onClick={this.handleLogoClick} to="/"><div className="logo"><img className="image is-64x64" src={logo} alt="logo"/></div></NavLink> 
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} className="is-hidden-mobile" theme="light" mode="horizontal" style={{ lineHeight: '64px' }}>
                  <Menu.Item key="0"><NavLink to="/">Home</NavLink></Menu.Item>
                  <Menu.Item key="1"><NavLink to="/coffee">Coffee</NavLink></Menu.Item>
                  <Menu.Item key="2"><NavLink to="/coffee">Bread</NavLink></Menu.Item>
                  <Menu.Item key="3"><NavLink to="/cakes">Cakes</NavLink></Menu.Item>
                  <Menu.Item key="4"><NavLink to="/coffee">Order</NavLink></Menu.Item>
                  <Menu.Item key="5"><NavLink to="/coffee">About Us</NavLink></Menu.Item>
                  <Menu.Item key="6"><NavLink to="/coffee">Contact</NavLink></Menu.Item>
                  <Menu.Item key="7"><NavLink to="/login">Login</NavLink></Menu.Item>
                </Menu>  
              </Container>
            </Header>
            <Content style={{ overflow: 'initial', zIndex: 10 }}>     
              <Affix style={{ position: 'absolute', top: 70, right: '5%', zIndex: 20}}>
                <Button type="primary" className="is-pulled-right is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
              </Affix>
              <Container><Routes /></Container>          
            </Content>
            <Affix offsetBottom={0}>
              <Container>
                <Level>
                  <nav className="level is-mobile">            
                    <div className="level-item">
                        <a className="has-text-danger"><i class="fa fa-instagram fa-2x" aria-hidden="true"></i></a>
                    </div>
                    <div className="level-item">
                        <a className="has-text-info"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a>
                    </div>
                    <div className="level-item">
                        <a className="has-text-black-ter"><i class="fa fa-vk fa-2x" aria-hidden="true"></i></a>
                    </div>
                  </nav>
                </Level>
              </Container>
            </Affix>
          </Layout>
        </Layout>

    );
  }
}

export default App;