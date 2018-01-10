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

const Tablet = props => <Responsive {...props} minWidth={481} maxWidth={768} />;
const Mobile = props => <Responsive {...props} maxWidth={480} />;

const { Content } = Layout;
const bounceAnimation = keyframes`${bounceInUp}`;

const AffixBounce = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  position: absolute;
  top: 70px;
  right: 20%;
  @media only screen and (max-width: 1366px) {
    right: 10%;
  } 
  `;
const AffixMobile = styled(Affix)`
  animation: 1.5s ${bounceAnimation};
  right: 5%;
  font-size: 1rem;
`;
const PhoneButton = styled(Button)`
  padding: 5px;
  z-index: 50;
  @media only screen and (max-width: 768px) {
    z-index: 20;
  }
`;
const MobileFooter = styled.nav`
    background-color: rgba(51, 5, 28, .8);
    min-height: 2.25rem;
`;
const OuterContent = styled(Content)`
    z-index: 10;
    padding: 0 24px;
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
      this.toggleIconSize = this.toggleIconSize.bind(this);
  }

  userHasAuthenticated = authenticated => {
      this.setState({ isAuthenticated: authenticated });    
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.toggleIconSize);
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

    this.toggleIconSize();
    window.addEventListener('resize', this.toggleIconSize);

  }

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

  renderAffix() {
    const isLoggedIn = this.state.isAuthenticated;
    return (
      <MobileFooter className="navbar is-hidden-tablet is-fixed-bottom">            
        <div className="level is-mobile">
          <div className="level-item">
            <a aria-label="Instagram link" style={{ padding: 5 }} href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer" className="has-text-danger"><i ref={instaicon => this.instaicon = instaicon} className="fa fa-instagram"></i></a>
        </div>
        <div className="level-item">
            <a aria-label="Facebook link" href="https://www.facebook.com/Confert.ru?hc_ref=ARQwxWrZK8Qop0XtLeqPjPcqJ1wPtua1EdfzTK52K7tmK-2nGd4iaI_rXNi733RwaCA&fref=nf" target='_blank' rel="noopener noreferrer" className="has-text-info"><i className="fa fa-facebook"></i></a>
        </div>
        <div className="level-item">
            <Link aria-label="Contact link" to="/contact" className="has-text-white"><i className="fa fa-envelope-o" aria-hidden="true"></i></Link>
        </div>
        <div className="level-item">
            <Link aria-label="Login link" to="/login" className="has-text-white">{
              isLoggedIn ? <i className="fa fa-unlock" aria-hidden="true"></i> : <i onClick={this.handleIconClick} className="fa fa-lock" aria-hidden="true"></i>}</Link>
        </div>
        </div>
      </MobileFooter>
    )
  }

  renderAffixPhoneButton() {
    return (
     <div>
      <Mobile>
        <AffixMobile offsetBottom={40}>
          <PhoneButton name="phone number" type="primary" className="is-size-6"><Icon type="phone" /> +7 (926) 629 87 26</PhoneButton>
        </AffixMobile>
      </Mobile>
      <Tablet>
        <AffixMobile offsetBottom={55}>
          <PhoneButton name="phone number" type="primary" className="is-size-5"><Icon type="phone" /> +7 (926) 629 87 26</PhoneButton>
        </AffixMobile>
      </Tablet>
     </div>
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
              <AffixBounce className="is-hidden-mobile" offsetTop={105}>
                <PhoneButton name="phone number" type="primary" className="is-size-5"><Icon type="phone" /> +7 (926) 629 87 26</PhoneButton>
              </AffixBounce>
          
              <InnerContainer>
                <Header location={this.props.location} />
                <Routes childProps={childProps} />
                {this.renderAffixPhoneButton()}
              </InnerContainer>
              <footer className="footer is-hidden-mobile">
                <div className="container">
                  <div className="content has-text-centered">
                    <nav className="level">
                      <div className="level-item has-text-centered">
                        <div>
                          <a href="https://www.instagram.com/confertru.ru" target='_blank' rel="noopener noreferrer"><i ref={instaicon => this.instaicon = instaicon} className="fa fa-instagram" style={{ color: '#fb3958' }}></i></a>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <a href="https://www.facebook.com/CONFERTRU.RU" target='_blank' rel="noopener noreferrer" className="facebook"><Icon type="facebook" style={{ fontSize: 28, color: '#3b5998' }} /></a>
                        </div>
                      </div>
                      <div className="level-item has-text-centered">
                        <div>
                          <Link to="/contact" className="has-text-grey"><i className="fa fa-envelope-o" aria-hidden="true"></i></Link>
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
                      <strong>© 2017 Все булочки тут.</strong> | Услуги разработчика: <a target='_blank' rel="noopener noreferrer" href="https://akolybelnikov.github.io/">Андрей Колыбельников</a>. | Программный код страницы защищён лицензией.
                    </p>
                  </div>
                </div>
              </footer>
            </OuterContent>
          </Layout>
          {this.renderAffix()}
        </Layout>
    );
  }
}