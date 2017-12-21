import React from "react";
import { NavLink } from "react-router-dom";
import { Input } from 'antd';
import styled from "styled-components";

const logo = require(`../public/logo.png`);
const Logo = styled.img`
    max-width: 150px;
    padding-top: 5px;
    @media only screen and (max-width: 480px) {
        max-width: 120px;
    }
`
const Search = styled(Input.Search)`

`

export default class Header extends React.Component {

    componentDidMount() {

        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        
        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {
        
            // Add a click event on each of them
            $navbarBurgers.forEach(function ($el) {
                $el.addEventListener('click', function () {
            
                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);
                   
                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
            
                });
            });
        }
        
    }

    render() {
        return (            
            <nav className="navbar is-fixed-top is-transparent" aria-label="main navigation" style={{zIndex: "30"}}>
                <div className="navbar-brand">
                    <NavLink to="/"><Logo className="image is-hidden-tablet navbar-item" src={logo} alt="logo"/></NavLink>
                    <button className="button navbar-burger" data-target="navMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div className="navbar-menu level" id="navMenu">                    
                    <p className="level-item has-text-centered">
                        <NavLink key="0" className="menu-item" to="/">Новинки</NavLink>
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