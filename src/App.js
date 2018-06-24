import React from 'react';
import { authUser } from "./libs/awsLib";
import Header from "./components/Header";
import LoadingScreen from './components/LoadingScreen';
import SearchModal from './components/SearchModal';
import { Link } from "react-router-dom";
import { Layout, Icon, Affix, notification } from 'antd';
import Routes from "./Routes";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import { setTimeout } from 'timers';
import Responsive from 'react-responsive';
import './App.css';

const Desktop = props => <Responsive {...props} minWidth={769} />;
const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={768} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const { Content } = Layout;
const bounceAnimation = keyframes`${bounceInUp}`;

const AffixBounce = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  position: absolute; 
  z-index: 100;
  left: 85%;
  @media screen and (min-width: 768px) {
    .ant-btn-circle.ant-btn-lg {
      width: 52px;
      height: 52px;
      font-size: 28px;
    }
    .ant-btn > .anticon {
      line-height: 1.8;
    }
  }
`;

const MobileFooter = styled.nav`
    background-color: rgba(51, 5, 28, .8) !important;
    min-height: 2.25rem !important;

    .insta-icon {
      width: 16px;
      margin-top: 3px;
    }

    @media screen and (min-width: 768px) {
      min-height: 3rem !important;
      .insta-icon {
        width: 26px;
        margin-top: 7px;
      }
      .level-item > a {
        font-size: 26px;
      }
    }
`;
const OuterContent = styled(Content)`
    z-index: 10;
    padding: 0 24px;
    @media only screen and (max-width: 767px) {
      padding: 0 6px;
    }
  }

`;
const InnerContainer = styled.div`
  max-width: 1024px;
  @media only screen and (min-width: 992px) {
      margin: 0 auto;
      padding: 20px 0;
    }
  }  
`;

export default class App extends React.Component {

  constructor(props) {
      super(props);

      this.state = { 
          isAuthenticated: false,
          isAuthenticating: true,
          isLoading: true,
          mobileSearchVisible: false
      };
  }

  handleMobileSearch = () => {
    this.state.mobileSearchVisible ? this.setState({ mobileSearchVisible: false }) : this.setState({ mobileSearchVisible: true });
  }

  userHasAuthenticated = authenticated => {
      this.setState({ isAuthenticated: authenticated });    
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    } catch(e) {
      this.openErrorNotification();
    }

    this.setState({ 
      isAuthenticating: false,
      isLoading: false
    });

    setTimeout(() => {
      this.setState({
        isLoadingAffix: false
      });
    }, 2000);
  }

  openErrorNotification () {
    notification['error']({
      message: 'Произошла ошибка при загрузке!',
      description: 'Пожалуйста, попробуйте загрузить приложение ещё раз.'
    });
  };

  renderAffix() {
    const isLoggedIn = this.state.isAuthenticated;
    return (
      <MobileFooter className="navbar is-hidden-tablet is-fixed-bottom">            
        <div className="level is-mobile">
          <div className="level-item">
            <a aria-label="Instagram link" style={{ padding: 5 }} href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><Icon type="instagram" style={{ color: 'rgba(252,63,116,1'}} /></a>
        </div>
        <div className="level-item">
            <a aria-label="Facebook link" href="https://www.facebook.com/CONFERTRU.RU" target='_blank' rel="noopener noreferrer" className="has-text-info"><Icon type="facebook" /></a>
        </div>
        <div className="level-item">
            <Link aria-label="Contact link" to="/contact" className="has-text-white"><Icon type="mail" /></Link>
        </div>
        <div className="level-item">
            <Link aria-label="Login link" to="/login" className="has-text-white">{
              isLoggedIn ? <Icon type="unlock" /> : <Icon type="lock" />}</Link>
        </div>
        </div>
      </MobileFooter>
    )
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    const isLoggedIn = this.state.isAuthenticated;
    return (
      this.state.isLoading ? <LoadingScreen /> :
      !this.state.isAuthenticating &&
        <Layout style={{height: '100vh'}}>           
          <Layout style={{ background: "white" }} >            
            <OuterContent>     
              <Mobile>
                <AffixBounce offsetTop={85}>
                  <a href="tel:+79266298726" name="phone number" target="_self" className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only"><Icon type="customer-service" /></a>
                </AffixBounce>
              </Mobile>
              <Tablet>
                <AffixBounce offsetTop={100}>
                  <a href="tel:+79266298726" name="phone number" target="_self" className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only ant-btn-lg"><Icon type="customer-service" /></a>
                </AffixBounce>
              </Tablet>
              <Desktop>
                <AffixBounce offsetTop={100}>
                  <a href="tel:+79266298726" name="phone number" target="_self" className="ant-btn ant-btn-primary ant-btn-circle ant-btn-icon-only ant-btn-lg"><Icon type="customer-service" /></a>
                </AffixBounce>
              </Desktop>
              <InnerContainer>
                <Header location={this.props.location} setMobileSearchModalVisible={this.handleMobileSearch} />
                <SearchModal mobileModalVisible={this.state.mobileSearchVisible} setMobileSearchModalVisible={this.handleMobileSearch} />
                <Routes childProps={childProps} />                
              </InnerContainer>
              <footer className="footer navbar is-hidden-mobile" style={{background: 'rgba(255, 255, 255, 0.8)', maxWidth: 1024, margin: '40px auto', padding: '.5rem'}}>
                <div className="content has-text-centered">
                  <nav className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer"><Icon type="instagram" style={{ fontSize: 28, color: 'rgba(252,63,116,1'}} /></a>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <a href="https://www.facebook.com/CONFERTRU.RU" target='_blank' rel="noopener noreferrer" className="facebook"><Icon type="facebook" style={{ fontSize: 28, color: '#3b5998' }} /></a>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <Link to="/contact" className="has-text-grey"><Icon style={{ fontSize: 28, color: 'rgba(94,32,59,1)'}} type="mail"/></Link>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <Link className="icon-link" to="/login">
                          { isLoggedIn ? <Icon style={{ fontSize: 28}} type="unlock" /> : <Icon style={{ fontSize: 28, color: 'rgba(161,113,116,1)'}} type="lock" /> }</Link>
                        </div>
                    </div>
                  </nav>
                  <p>
                    <strong>© 2017 Все булочки тут.</strong> | Услуги разработчика: <strong>Андрей Колыбельников</strong>. | Программный код страницы защищён лицензией.
                  </p>
                </div>
              </footer>
            </OuterContent>
          </Layout>
          {this.renderAffix()}
        </Layout>
    );
  }
}