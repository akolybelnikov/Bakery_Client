import React, { Component } from 'react';
import { authUser, signOutUser } from "./libs/awsLib";
import { NavLink, Link, withRouter } from "react-router-dom";
import { Layout, Menu, Icon, Button, Affix, Input } from 'antd';
import './App.css';
import Routes from "./Routes";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';

const logo = require(`./mstile-150x150.png`);
const { Header, Content, Sider } = Layout;
const Search = Input.Search;
const bounceAnimation = keyframes`${bounceInUp}`;

const AffixBounce = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  position: absolute;
  top: 70;
  right: 5%;
  zIndex: 20;
`;

const Container = styled.div`
    max-width: 1010px;
    margin: 0 auto;
`;
const Level = styled.div`
    background-color: rgba(250, 144, 186, .8);
`;
const OuterContent = styled(Content)`
    z-index: 10;
    padding: 0 24px;
`;
const InnerContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding-top: 35px;
`;

class App extends Component {

  constructor(props) {
      super(props);

      this.state = { 
          current: '0', 
          isAuthenticated: false,
          isAuthenticating: true
      };
      // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  userHasAuthenticated = authenticated => {
      this.setState({ isAuthenticated: authenticated });    
  }

  // componentWillUnmount() {
  //     window.removeEventListener('resize', this.updateWindowDimensions);
  // }

  // updateWindowDimensions() {
  //     this.setState({ height: window.innerHeight - 162 });
  // }

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
    signOutUser();

    this.userHasAuthenticated(false);
    
    this.props.history.push('/login');
  }

  // calcHeight() {
    
  //   return rect.height;
  // }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
        //this.updateWindowDimensions();
       // window.addEventListener('resize', this.updateWindowDimensions);
      }
    } catch(e) {
      console.log(e);
    }
    this.setState({ isAuthenticating: false });
    if (this.props.location.pathname === '/products') {
      this.setState({ current: "1"})
    }
    if (this.props.location.pathname === '/products') {
      this.setState({ current: "1"})
    }
    //window.addEventListener('resize', this.calcHeight());
    // const rect = this.container.getBoundingClientRect();
    //console.log(this.container.getBoundingClientRect());
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
              <Menu.Item key="0"><NavLink to="/"><Icon type="home" />Новинки</NavLink></Menu.Item>
              <Menu.Item key="1"><NavLink to="/coffee"><Icon type="coffee" />Кофе</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to="/coffee"><Icon type="shop" />Хлеб</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to="/cakes"><Icon type="gift" />Кондитерка</NavLink></Menu.Item>
              <Menu.Item key="4"><NavLink to="/coffee"><Icon type="shopping-cart" />На заказ</NavLink></Menu.Item>
              <Menu.Item key="5"><NavLink to="/coffee"><Icon type="trademark" />О нас</NavLink></Menu.Item>
              <Menu.Item key="6"><NavLink to="/coffee"><Icon type="mail" />Контакт</NavLink></Menu.Item>
            </Menu>
          </Sider>            
          <Layout style={{ background: "white" }} >
            <Header className="header">
              <Container>
              <Search placeholder="поиск по сайту" style={{ width: 150, position: "absolute", right: "30%" }} onSearch={value => console.log(value)}
            />
                <NavLink onClick={this.handleLogoClick} to="/"><div className="logo"><img className="image is-64x64" src={logo} alt="logo"/></div></NavLink> 
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} className="is-hidden-mobile" theme="light" mode="horizontal" style={{ lineHeight: '64px' }}>
                  <Menu.Item key="0"><NavLink to="/">Новинки</NavLink></Menu.Item>
                  <Menu.Item key="1"><NavLink to="/products">Ассортимент</NavLink></Menu.Item>
                  <Menu.Item key="2"><NavLink to="/coffee">О нас</NavLink></Menu.Item>
                  <Menu.Item key="3"><NavLink to="/coffee">Контакт</NavLink></Menu.Item>
                </Menu>  
              </Container>
            </Header>
            <OuterContent ref={div => this.container = div}>     
              <AffixBounce>
                <Button type="primary" className="is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
              </AffixBounce>
              <InnerContainer><Routes childProps={childProps} /></InnerContainer>
            </OuterContent>
            <Affix offsetBottom={0} style={{ zIndex: 20 }}>
              <Container>
                <Level>
                  <nav className="level is-mobile">            
                    <div className="level-item">
                        <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><i className="fa fa-instagram fa-2x"></i></a>
                    </div>
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-info"><i className="fa fa-facebook fa-2x" aria-hidden="true"></i></Link>
                    </div>
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-black-ter"><i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i></Link>
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

export default withRouter(App);