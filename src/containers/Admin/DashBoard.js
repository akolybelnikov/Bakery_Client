import React from "react";
import { signOutUser } from "../../libs/awsLib";
import { Row } from 'antd';
import { Link } from "react-router-dom";
import "./Admin.css";

export default class AdminDashBoard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [{
                title: "Хлеб и булки",
                key: 'bread'
            }, {
                title: "Кофе и другие напитки",
                key: 'coffee'
            }, {
                title: "Кондитерские изделия",
                key: 'cakes'
            }, {
                title: "Торты на заказ",
                key: 'order'
            }]
        };
    }

    handleLogout = (e) => {
        signOutUser();
    
        this.props.userHasAuthenticated(false);        
        this.props.history.push('/');
    }

    handleCategoryClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderCategories(categories) {
        return categories.map(
            (category) =>
            <section style={{ cursor: 'pointer'}} href={`/admin/${category.key}`} onClick={this.handleCategoryClick} className="hero" key={category.title}>
                <div className="hero-body">
                    <div className="hero-container">
                        <p className="subtitle">
                            {category.title}
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    render() {
        return (
            <div>
                <Row style={{marginTop: "10px"}}>
                    <p className="has-text-info is-size-7-mobile is-size-5-tablet">Управление продуктами</p>
                    <p className="has-text-grey-light is-size-7-mobile is-size-5-tablet">Выберите продукт и внесите изменения. Либо удалите продукт из категории.</p>
                </Row>
                <Row style={{marginTop: "10px"}}>
                    <Link to="/create" className="button is-small-mobile is-outlined is-warning is-medium-tablet">
                        <span className="icon is-small"><i className="fa fa-plus"></i></span>
                        <span>Создать продукт</span>
                    </Link>
                </Row>
                <Row style={{marginTop: "10px", textAlign: "center"}}>
                    {this.renderCategories(this.state.categories)}
                </Row>
                <Row style={{marginBottom: "35px"}}>
                    <a  onClick={this.handleLogout} className="button is-small-mobile is-outlined is-medium-tablet is-danger is-pulled-right">
                        <span className="icon is-small" ><i className="fa fa-sign-out"></i></span>
                        <span>Выйдти</span>
                    </a>
                </Row>
            </div>
        );
    }
}