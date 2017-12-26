import React from "react";
import { NavLink } from "react-router-dom";
import { Input, Icon, Button } from 'antd';
import styled from "styled-components";

const logo = require(`../public/logo.png`);
const Logo = styled.img`
    max-width: 150px;
    padding-top: 5px;
    @media only screen and (max-width: 480px) {
        max-width: 130px;
    }
`
const Search = styled(Input.Search)`

`

export default class Header extends React.Component {

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
                    console.log($target)
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

         $menu.classList.toggle('is-active');
    }

    render() {
        return (            
            <nav className="navbar is-fixed-top" aria-label="main navigation" style={{zIndex: "30", background: "rgba(255, 255, 255, 0.8)", maxWidth: '1024px', margin: '0 auto'}}>
                <div className="navbar-brand level" style={{marginBottom: 0}}>
                    <p className="level-item is-hidden-tablet"><Icon style={{ fontSize: 28, color: '#52082D' }} type="search" className="navbar-item"/></p>
                    <p className="level-item is-hidden-tablet"><NavLink to="/"><Logo className="image navbar-item" src={logo} alt="logo"/></NavLink></p>
                    <p className="level-item is-hidden-tablet">
                        <Button style={{ fontSize: 26, background: 'transparent'}} className="button navbar-burger" data-target="navMenu"><Icon type="menu-unfold" id="menu-icon"/></Button>
                    </p>
                </div>
                <div className="navbar-menu level" id="navMenu">                    
                    <p className="level-item has-text-centered">
                        <NavLink onClick={this.handleMenuClick} key="0" className="menu-item" to="/">Новинки</NavLink>
                    </p>
                    <p className="level-item has-text-centered">
                        <NavLink key="1" className="menu-item" to="/products">Ассортимент</NavLink>
                    </p>
                    <p className="level-item has-text-centered is-hidden-mobile">
                        <NavLink to="/"><Logo className="image" src={logo} alt="logo"/></NavLink> 
                    </p>
                    <p className="level-item has-text-centered">
                        <NavLink key="2" className="menu-item" to="/contact">Контакт</NavLink>
                    </p>
                    <p className="level-item has-text-centered is-hidden-mobile">
                        <Search placeholder="поиск по сайту" onSearch={value => console.log(value)} />
                    </p>                 
                </div>
            </nav>         
        );
    }
}