import React from 'react';
import { authUser } from "./libs/awsLib";
import Header from "./components/Header";
import LoadingScreen from './components/LoadingScreen';
import { Link } from "react-router-dom";
import { Layout, Icon, Button, Affix } from 'antd';
import './App.css';
import Routes from "./Routes";
import styled, { keyframes } from 'styled-components';
import { bounceInUp } from 'react-animations';
import { setTimeout } from 'timers';
import Responsive from 'react-responsive';
import 'bulma/css/bulma.css';
import instaIcon from './public/instagram.svg';

const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={768} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;
const Desktop = props => <Responsive {...props} minWidth={769} />

const { Content } = Layout;
const bounceAnimation = keyframes`${bounceInUp}`;

const AffixBounce = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  position: absolute; 
  right: 2%;
  @media only screen and (max-width: 768px) {
    right: 5%;
  }
  @media only screen and (min-width: 1300px) {
    right: 15%;
  }
`;

const MobileFooter = styled.nav`
    background-color: rgba(51, 5, 28, .8) !important;
    min-height: 2.25rem !important;
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
          isLoading: true
      };
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
      console.log(e);
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

  renderAffix() {
    const isLoggedIn = this.state.isAuthenticated;
    return (
      <MobileFooter className="navbar is-hidden-tablet is-fixed-bottom">            
        <div className="level is-mobile">
          <div className="level-item">
            <a aria-label="Instagram link" style={{ padding: 5 }} href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><img src={instaIcon} className="insta-icon" alt="instagram" /></a>
        </div>
        <div className="level-item">
            <a aria-label="Facebook link" href="https://www.facebook.com/Confert.ru?hc_ref=ARQwxWrZK8Qop0XtLeqPjPcqJ1wPtua1EdfzTK52K7tmK-2nGd4iaI_rXNi733RwaCA&fref=nf" target='_blank' rel="noopener noreferrer" className="has-text-info"><Icon type="facebook" /></a>
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
        <Layout>           
          <Layout style={{ background: "white" }} >            
            <OuterContent>     
              <Mobile>
                <AffixBounce offsetTop={80}>
                  <Button name="phone number" type="primary" className="is-size-7"><Icon type="phone" /> +7 (926) 629 87 26</Button>
                </AffixBounce>
              </Mobile>
              <Tablet>
                <AffixBounce offsetTop={100}>
                  <Button name="phone number" type="primary" className="is-size-6"><Icon type="phone" /> +7 (926) 629 87 26</Button>
                </AffixBounce>
              </Tablet>
              <Desktop>
                <AffixBounce offsetTop={110}>
                  <Button name="phone number" type="primary" className="is-size-5"><Icon type="phone" /> +7 (926) 629 87 26</Button>
                </AffixBounce>
              </Desktop>
              <InnerContainer>
                <Header location={this.props.location} />
                <Routes childProps={childProps} />                
              </InnerContainer>
              <footer className="footer navbar is-hidden-mobile" style={{background: 'rgba(255, 255, 255, 0.8)', maxWidth: 1024, margin: '0px auto', padding: '.5rem'}}>
                <div className="content has-text-centered">
                  <nav className="level is-mobile">
                    <div className="level-item has-text-centered">
                      <div>
                        <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer"><img src={instaIcon} style={{ width: 26, marginTop: -3 }} alt="instagram" /></a>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <a href="https://www.facebook.com/CONFERTRU.RU" target='_blank' rel="noopener noreferrer" className="facebook"><Icon type="facebook" style={{ fontSize: 28, color: '#3b5998' }} /></a>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <Link to="/contact" className="has-text-grey"><Icon style={{ fontSize: 28}} type="mail"/></Link>
                      </div>
                    </div>
                    <div className="level-item has-text-centered">
                      <div>
                        <Link className="icon-link" to="/login">
                          { isLoggedIn ? <Icon style={{ fontSize: 28}} type="unlock" /> : <Icon style={{ fontSize: 28}} type="lock" /> }</Link>
                        </div>
                    </div>
                  </nav>
                  <p>
                    <strong>© 2017 Все булочки тут.</strong> | Услуги разработчика: <a target='_blank' rel="noopener noreferrer" href="https://akolybelnikov.github.io/">Андрей Колыбельников</a>. | Программный код страницы защищён лицензией.
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