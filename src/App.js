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
  right: 5%;
  @media only screen and (min-width: 768px) {
    bottom: 40px;
  }  
`;
const PhoneButton = styled(Button)`
  z-index: 50;
  @media only screen and (max-width: 768px) {
    z-index: 20;
  }
`

const Container = styled.div`
    max-width: 1024px;
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
          isLoadingAffix: true
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
      !this.state.isLoadingAffix &&
      <Affix offsetBottom={0} id="footer" style={{ zIndex: 20 }} className="is-hidden-tablet">
      <Container>
        <Level>
          <nav className="level is-mobile is-fixed-bottom">            
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
    )
  }

  renderAffixPhoneButton() {
    return (
      !this.state.isLoadingAffix &&
      <AffixMobile className="is-hidden-tablet" offsetBottom={30}>
        <PhoneButton type="primary" className="is-size-7"><Icon type="phone" /> +7 (926) 629 87 26</PhoneButton>
      </AffixMobile>
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
            
            <OuterContent ref={div => this.container = div}>     
              <AffixBounce className="is-hidden-mobile" offsetTop={105}>
                <PhoneButton type="primary" className="is-size-6"><Icon type="phone" /> +7 (926) 629 87 26</PhoneButton>
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
                          <a href="https://www.facebook.com/Confert.ru?hc_ref=ARQwxWrZK8Qop0XtLeqPjPcqJ1wPtua1EdfzTK52K7tmK-2nGd4iaI_rXNi733RwaCA&fref=nf" target='_blank' rel="noopener noreferrer" className="facebook"><Icon type="facebook" style={{ fontSize: 28, color: '#3b5998' }} /></a>
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