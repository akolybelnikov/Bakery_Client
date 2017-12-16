import React from "react";
import { signOutUser } from "../../libs/awsLib";
import { Row, Col } from 'antd';
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
            }, {
                title: "Новости",
                key: 'news'
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
                <Row style={{marginTop: "20px"}}>
                    <p style={{color: "#52082D"}} className="is-size-7-mobile is-size-5-tablet">Управление продуктами</p>
                </Row>
                <Row style={{marginTop: "10px"}}>
                    <Col xs={24} sm={8} className="has-text-centered btn-new">
                        <Link to="/create" className="button is-small-mobile is-medium-tablet is-warning is-inverted">
                            <span className="icon is-small"><i className="fa fa-plus"></i></span>
                            <span>Создать продукт</span>
                        </Link>
                    </Col>
                    <Col xs={24} sm={8} className="has-text-centered btn-new">
                        <Link to="/newoffer" className="button is-small-mobile is-medium-tablet is-warning is-inverted">
                            <span className="icon is-small"><i className="fa fa-plus"></i></span>
                            <span>Спецпредложение</span>            
                        </Link>
                    </Col>
                    <Col xs={24} sm={8} className="has-text-centered btn-new">
                        <Link to="/createnews" className="button is-small-mobile is-medium-tablet is-warning is-inverted">
                            <span className="icon is-small"><i className="fa fa-plus"></i></span>
                            <span>Создать новость</span>            
                        </Link>
                    </Col>
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