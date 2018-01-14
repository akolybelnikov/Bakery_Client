import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Input, Icon, Button, List, Row, Col, message } from 'antd';
import styled from "styled-components";
import { invokeOpenApi } from "../libs/awsLib";
import config from "../config";

const Search = Input.Search;
const listData = [];

const logo = require(`../public/logo.png`);
const Logo = styled.img`
    max-width: 150px;
    padding-top: 5px;
    @media only screen and (max-width: 480px) {
        max-width: 130px;
    }
`
const InputSearch = styled(Search)`
    [disabled] {
        border: none;
    }
`

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            products: [],
            disabled: false
        };
      }

    async componentDidMount() {

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

    getBread() {
        return invokeOpenApi({ path: `/categories/bread` });
    }

    getCoffee() {
        return invokeOpenApi({ path: `/categories/coffee` });
    }

    getCakes() {
        return invokeOpenApi({ path: `/categories/cakes` });
    }

    getOrder() {
        return invokeOpenApi({ path: `/categories/order` });
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
    }

    async handleSearch(value) {

        const products = [];

        try {
            const bread = await this.getBread();
            const coffee = await this.getCoffee();
            const cakes = await this.getCakes();
            const order = await this.getOrder();
            products.push(bread, coffee, cakes, order);
            const allProducts = products.reduce((a, b) => a.concat(b), []);
            this.setState({
                products: allProducts
            });
        } catch (e) {
            message.error(e, 5);
        }

        for (let product of this.state.products) {
            if (product.productName.toLowerCase().match(value.toLowerCase()) || product.content.toLowerCase().match(value.toLowerCase())) {
                listData.push(product);
            }
        }
        if (listData.length > 0) {
            var $modal = document.getElementById('search-modal');
            $modal.classList.toggle('is-active');

            var $searchButton = Array.prototype.slice.call(document.querySelectorAll('.ant-input-search-button'), 0);
            $searchButton.forEach(function($el) {
                $el.disabled = true;
            });

            this.setState({disabled: true});

        } else {
            message.error('Наименований не найдено! Попробуйте изменить условия поиска.', 5);
        }

        this.setState({searchValue: ''});
    }

    handleProductClick = (e) => {
        e.preventDefault();
        this.props.history.push(e.currentTarget.getAttribute("href"));
        this.closeModal();
    }

    closeModal = () => {
        var $modal = document.getElementById('search-modal');
        $modal.classList.toggle('is-active');  

        listData.splice(0);

        this.setState({disabled: false});

        var $searchButton = Array.prototype.slice.call(document.querySelectorAll('.ant-input-search-button'), 0);
        $searchButton.forEach(function($el) {
            $el.disabled = false;
        });
    }

    render() {
        return (            
            <div>
                <nav className="navbar is-fixed-top" aria-label="main navigation" style={{zIndex: "30", background: "rgba(255, 255, 255, 0.8)", maxWidth: '1024px', margin: '0 auto'}}>
                    <div className="navbar-brand level" style={{marginBottom: 0}}>
                        <p className="level-item is-hidden-desktop"><Icon style={{ fontSize: 28, color: '#52082D' }} type="search" className="navbar-item"/></p>
                        <p className="level-item is-hidden-desktop"><NavLink to="/"><Logo className="image navbar-item" src={logo} alt="logo"/></NavLink></p>
                        <p className="level-item is-hidden-desktop">
                            <Button name="menu button" style={{ fontSize: 26, background: 'transparent'}} className="button navbar-burger" data-target="navMenu"><Icon type="menu-unfold" id="menu-icon"/></Button>
                        </p>
                    </div>
                    <div className="navbar-menu level" id="navMenu"> 
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink to="/"><Logo className="image" src={logo} alt="logo"/></NavLink> 
                        </p>                   
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item header-link" to="/">Новинки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/products/bread">Хлеб и Булки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/products/coffee">Кофе и Напитки</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/products/cakes">Кондитерские изделия</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/products/order">Торты на заказ</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item header-link" to="/products">Ассортимент</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/contact">Контакт</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item header-link" to="/contact">Контакт</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-desktop">
                            <NavLink onClick={this.handleMenuClick} className="menu-item header-link" to="/news">Новости</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <NavLink className="menu-item header-link" to="/news">Новости</NavLink>
                        </p>
                        <p className="level-item has-text-centered is-hidden-mobile">
                            <InputSearch disabled={this.state.disabled} value={this.state.searchValue} placeholder="поиск по сайту" onChange={this.handleChange} onSearch={value => this.handleSearch(value)} enterButton/>
                        </p>                 
                    </div>
                </nav>
                <div className="modal is-hidden-mobile" id="search-modal" style={{zIndex: 100}}>
                    <div id="modal-background" onClick={this.closeModal} className="modal-background"></div>
                    <div className="modal-card" style={{position: 'absolute', top: 30}}>
                        <header className="modal-card-head" style={{textAlign: 'right'}}>
                            <button style={{backgroundColor: '#52082D', marginBottom: 10}} onClick={this.closeModal} className="delete is-large" aria-label="close"></button>
                        </header>
                        <div className="modal-card-body">
                            <List
                                itemLayout="vertical"
                                size="large"
                                dataSource={listData}
                                renderItem={item => (
                                <List.Item style={{background: 'white', cursor: 'pointer', padding: 20}}
                                    href={`/products/${item.category}/${item.productId}`}
                                    onClick={this.handleProductClick}
                                    key={item.productId}
                                    actions={[<p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Вес: </span>{item.weight}</p>, <p className="is-size-7" style={{color: '#331507'}}><span style={{color: '#52082D'}}>Цена: </span>{item.price} руб.</p>]}
                                >
                                    <List.Item.Meta
                                    title={item.productName}
                                />
                                    <Row>
                                        <Col xs={16}>{item.content}</Col>
                                        <Col xs={8}><img alt="" src={`${config.s3.URL}/200x200/${item.image}`} /></Col>
                                    </Row>
                                </List.Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>         
        );
    }
}

export default withRouter(Header)