import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Input, Icon, Button, List } from 'antd';
import styled from "styled-components";

const Search = Input.Search;

const logo = require(`../public/logo.png`);
const Logo = styled.img`
    max-width: 150px;
    padding-top: 5px;
    @media only screen and (max-width: 480px) {
        max-width: 130px;
    }
`

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };
      }

    componentDidMount() {

        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        var $menuIcon = document.getElementById('menu-icon');
        
        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {
        
            // Add a click event on each of them
            $navbarBurgers.forEach(function ($el) {
                $el.addEventListener('click', function () {
            
                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);
                
                    // Toggle the class on the "navbar-menu"                  
                    $target.classList.toggle('is-active');

                    // Togglethe class on the menu icon
                    if ($menuIcon.classList.contains('anticon-menu-unfold')) {
                        $menuIcon.classList.remove('anticon-menu-unfold');
                        $menuIcon.classList.add('anticon-close');
                    } else {
                        $menuIcon.classList.remove('anticon-close');
                        $menuIcon.classList.add('anticon-menu-unfold'); 
                    }
            
                });
            });
        }
        
    }

    handleMenuClick() {
        var $menu = document.getElementById('navMenu');
        var $menuIcon = document.getElementById('menu-icon');

        $menu.classList.toggle('is-active');

         // Togglethe class on the menu icon         
        $menuIcon.classList.remove('anticon-close');
        $menuIcon.classList.add('anticon-menu-unfold');
    }

    handleChange = (e) => {
        this.setState({searchValue: e.target.value});
        console.log(this.state.searchValue);
    }

    handleSearch(value) {
        var $modal = document.getElementById('search-modal');
        $modal.classList.toggle('is-active');
        this.setState({searchValue: ''});
    }

    closeModal() {
        var $modal = document.getElementById('search-modal');
        $modal.classList.toggle('is-active');      
    }

    render() {
        return (            
            <div>
                <nav className="navbar is-fixed-top" aria-label="main navigation" style={{zIndex: "30", background: "rgba(255, 255, 255, 0.8)", maxWidth: '1024px', margin: '0 auto'}}>
                    <div className="navbar-brand level" style={{marginBottom: 0}}>
                        <p className="level-item is-hidden-desktop"><Icon style={{ fontSize: 28, color: '#52082D' }} type="search" className="navbar-item"/></p>
                        <p className="level-item is-hidden-desktop"><NavLink to="/"><Logo className="image navbar-item" src={logo} alt="logo"/></NavLink></p>
                        <p className="level-item is-hidden-desktop">
                            <Button style={{ fontSize: 26, background: 'transparent'}} className="button navbar-burger" data-target="navMenu"><Icon type="menu-unfold" id="menu-icon"/></Button>
                        </p>
                    </div>
                    <div className="navbar-menu level" id="navMenu">                    
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item" to="/">Новинки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/products/bread">Хлеб и Булки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/products/coffee">Кофе и Напитки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/products/cakes">Кондитерские изделия</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/products/order">Торты на заказ</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item" to="/products">Ассортимент</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink to="/"><Logo className="image" src={logo} alt="logo"/></NavLink> 
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/contact">Контакт</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item" to="/contact">Контакт</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item" to="/news">Новости</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item" to="/news">Новости</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <Search value={this.state.searchValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>
                        </p>                 
                    </div>
                </nav>
                <div className="modal is-hidden-mobile" id="search-modal">
                    <div id="modal-background" onClick={this.closeModal} className="modal-background"></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                            <button onClick={this.closeModal} className="delete is-large" aria-label="close"></button>
                        </section>
                    </div>
                </div>
            </div>         
        );
    }
}

export default withRouter(Header)