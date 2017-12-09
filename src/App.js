import React, { Component } from 'react';
import { authUser } from "./libs/awsLib";
import { NavLink, Link, withRouter } from "react-router-dom";
import { Layout, Menu, Icon, Button, Affix, Input } from 'antd';
import './App.css';
import Routes from "./Routes";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';

const SubMenu = Menu.SubMenu;
const logo = require(`./public/mstile-150x150.png`);
const { Header, Content, Sider } = Layout;
const Search = Input.Search;
const bounceAnimation = keyframes`${bounceInUp}`;

const AffixBounce = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  position: absolute;
  top: 70px;
  right: 25%;
  zIndex: 20;
  @media only screen and (max-width: 480px) {
    right: 25px;
  }`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;
const Level = styled.div`
    background-color: rgba(51, 5, 28, .9);
`;
const OuterContent = styled(Content)`
    z-index: 10;
    padding: 0 24px;
`;
const InnerContainer = styled.div`
  max-width: 1200px;
  @media only screen and (min-width: 992px) {
      margin: 10px auto;
      padding: 20px 100px;
    }
  }  
`;

class App extends Component {

  constructor(props) {
      super(props);

      this.state = { 
          current: '0', 
          isAuthenticated: false,
          isAuthenticating: true
      };
      this.toggleIconSize = this.toggleIconSize.bind(this);
      // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  userHasAuthenticated = authenticated => {
      this.setState({ isAuthenticated: authenticated });    
  }

  componentWillUnmount() {
      // window.removeEventListener('resize', this.updateWindowDimensions);
      window.removeEventListener('resize', this.toggleIconSize);
  }

  // updateWindowDimensions() {
  //     this.setState({ height: window.innerHeight - 162 });
  // }

  toggleIconSize() {
    const faIcons = document.getElementsByClassName('fa');
    if (window.innerWidth >= 768) {
      for (let icon of faIcons) {
        icon.classList.add('fa-2x');
      }
    } else {
        for (let icon of faIcons) {
          if (icon.classList.contains('fa-2x')) {
            icon.classList.remove('fa-2x');
          }
        }        
      }
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
    this.toggleIconSize();
    window.addEventListener('resize', this.toggleIconSize);

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
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} theme="light" mode="vertical">
              <Menu.Item key="0"><NavLink to="/"><Icon type="home" />Новинки</NavLink></Menu.Item>

              <SubMenu key="sub1" title={<span><Icon type="appstore-o" /><span>Наш ассортимент</span></span>}>
              <Menu.Item key="1"><NavLink to="/products/bread"><Icon type="shop" />Хлеб и булки</NavLink></Menu.Item>
              <Menu.Item key="2"><NavLink to="/products/coffee"><Icon type="coffee" />Кофе и другие напитки</NavLink></Menu.Item>
              <Menu.Item key="3"><NavLink to="/products/cakes"><Icon type="gift" />Кондитерские изделия</NavLink></Menu.Item>
              <Menu.Item key="4"><NavLink to="/products/order"><Icon type="shopping-cart" />Торты на заказ</NavLink></Menu.Item>
              </SubMenu>
              
              <Menu.Item key="5"><NavLink to="/about-us"><Icon type="trademark" />О нас</NavLink></Menu.Item>
              <Menu.Item key="6"><NavLink to="/contact"><Icon type="mail" />Контакт</NavLink></Menu.Item>
            </Menu>
          </Sider>            
          <Layout style={{ background: "white" }} >
            <Header className="header">
              <Container>
              <Search placeholder="поиск по сайту" onSearch={value => console.log(value)}
            />
                <NavLink onClick={this.handleLogoClick} to="/"><div className="logo"><img className="image is-64x64" src={logo} alt="logo"/></div></NavLink> 
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} className="is-hidden-mobile" theme="light" mode="horizontal" style={{ lineHeight: '64px' }}>
                  <Menu.Item key="0"><NavLink to="/">Новинки</NavLink></Menu.Item>
                  <Menu.Item key="1"><NavLink to="/products">Ассортимент</NavLink></Menu.Item>
                  <Menu.Item key="2"><NavLink to="/about-us">О нас</NavLink></Menu.Item>
                  <Menu.Item key="3"><NavLink to="/contact">Контакт</NavLink></Menu.Item>
                </Menu>  
              </Container>
            </Header>
            <OuterContent ref={div => this.container = div}>     
              <AffixBounce>
                <Button style={{ zIndex: 20 }}  type="primary" className="is-size-7-mobile is-size-6"><Icon type="phone" /> 8 (095) 124-53-67</Button>
              </AffixBounce>
              <InnerContainer><Routes childProps={childProps} /></InnerContainer>
              <footer className="footer is-hidden-mobile">
                <div className="container">
                  <div className="content has-text-centered">
                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><i ref={instaicon => this.instaicon = instaicon} className="fa fa-instagram"></i></a>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <a href="https://www.facebook.com/Confert.ru?hc_ref=ARQwxWrZK8Qop0XtLeqPjPcqJ1wPtua1EdfzTK52K7tmK-2nGd4iaI_rXNi733RwaCA&fref=nf" target='_blank' rel="noopener noreferrer" className="facebook"><i className="fa fa-facebook"></i></a>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <Link to="/coffee" className="has-text-grey"><i className="fa fa-envelope-o" aria-hidden="true"></i></Link>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <Link to="/login" className="has-text-brown">{
                            isLoggedIn ? <i className="fa fa-unlock" aria-hidden="true"></i> : <i onClick={this.handleIconClick} className="fa fa-lock" aria-hidden="true"></i>}</Link>
                          </div>
                      </div>
                    </nav>
                    <p>
                      <strong>© 2014 VSE BULOCHKU TUT.</strong> by <a target='_blank' rel="noopener noreferrer" href="https://akolybelnikov.github.io/">Andrey Kolybelnikov</a>. The source code is licensed.
                    </p>
                  </div>
                </div>
              </footer>
            </OuterContent>
            <Affix offsetBottom={0} id="footer" style={{ zIndex: 20 }} className="is-hidden-tablet">
              <Container>
                <Level>
                  <nav className="level is-mobile">            
                    <div className="level-item">
                        <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><i ref={instaicon => this.instaicon = instaicon} className="fa fa-instagram"></i></a>
                    </div>
                    <div className="level-item">
                        <a href="https://www.facebook.com/Confert.ru?hc_ref=ARQwxWrZK8Qop0XtLeqPjPcqJ1wPtua1EdfzTK52K7tmK-2nGd4iaI_rXNi733RwaCA&fref=nf" target='_blank' rel="noopener noreferrer" className="has-text-info"><i className="fa fa-facebook"></i></a>
                    </div>
                    <div className="level-item">
                        <Link to="/coffee" className="has-text-white"><i className="fa fa-envelope-o" aria-hidden="true"></i></Link>
                    </div>
                    <div className="level-item">
                        <Link to="/login" className="has-text-white">{
                          isLoggedIn ? <i className="fa fa-unlock" aria-hidden="true"></i> : <i onClick={this.handleIconClick} className="fa fa-lock" aria-hidden="true"></i>}</Link>
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