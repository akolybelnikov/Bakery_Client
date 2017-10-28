import React, { Component } from 'react';
import { authUser } from "./libs/awsLib";
import { NavLink, Link } from "react-router-dom";
import { Layout, Menu, Icon, Button, Affix } from 'antd';
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
    background-color: rgba(220, 44, 44, 0.25);
`;
const OuterContent = styled(Content)`
    z-index: 10;
`;
const InnerContainer = styled.div.attrs({
  height: props => props.height
})`
  max-width: 910px;
  margin: 0 auto;
  min-height: ${props => props.height}px;
`;

export default class App extends Component {

  constructor(props) {
      super(props);
      this.state = { 
        current: '0', 
        height: window.innerHeight - 103, 
        isAuthenticated: false,
        isAuthenticating: true
  };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });    
  }

  componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
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

  handleIconClick = (e) => {
    this.setState({
      current: "7",
    });
  }

  handleLogout = (e) => {
    this.userHasAuthenticated(false);
  }

  updateWindowDimensions() {
      this.setState({ height: window.innerHeight - 103 });
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    } catch(e) {
      console.log(e);
    }
    this.setState({ isAuthenticating: false });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    const isLoggedIn = this.state.isAuthenticated;
    return (
      !this.state.isAuthenticating &&
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
            </Menu>
          </Sider>
            
          <Layout style={{ background: "white" }} >
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
                </Menu>  
              </Container>
            </Header>
            <OuterContent>     
              <Affix style={{ position: 'absolute', top: 70, right: '5%', zIndex: 20}}>
                <Button type="primary" className="is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
              </Affix>
              <InnerContainer height={this.state.height}><Routes childProps={childProps} /></InnerContainer>         
            </OuterContent>
            <Affix offsetBottom={0} style={{ zIndex: 20 }}>
              <Container>
                <Level>
                  <nav className="level is-mobile">            
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-danger"><i className="fa fa-instagram fa-2x" aria-hidden="true"></i></Link>
                    </div>
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-info"><i className="fa fa-facebook fa-2x" aria-hidden="true"></i></Link>
                    </div>
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-black-ter"><i className="fa fa-vk fa-2x" aria-hidden="true"></i></Link>
                    </div>
                    <div className="level-item">
                      <Link to="/login" className="has-text-black-ter">{
                        isLoggedIn ? <i onClick={this.handleLogout} className="fa fa-unlock fa-2x" aria-hidden="true"></i> : <i onClick={this.handleIconClick} className="fa fa-lock fa-2x" aria-hidden="true"></i>
                      }</Link>
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