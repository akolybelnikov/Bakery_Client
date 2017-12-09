import React from "react";
import config from "../config";
import axios from "axios";
import { Row, Col } from 'antd';
import ProgressiveImage from 'react-progressive-bg-image';
import styled from 'styled-components';

const Image = styled(ProgressiveImage)`
    min-height: 150px;
    background-size: cover;
    background-position: center center;
    @media only screen and (max-width: 480px) {
        min-height: 100px;
    } 
`
const bgImg = require(`../public/bg.jpg`);

export default class Instafeed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            loading: true
        };
    }

    async componentDidMount() {
       try {
           await axios.get(`https://api.instagram.com/v1/users/${config.instagram.REACT_APP_INSTAGRAM_USER_ID}/media/recent/?access_token=${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN}&&count=4`)
                .then(res => {
                    const posts = res.data.data.map(post => post.images.thumbnail);
                    for (let i = 0; i < posts.length; i++) {
                        posts[i]['key'] = i;
                    }
                    this.setState({ posts: posts});
                });         

       } catch (e) {
           console.log(e);
       }

       this.setState({ loading: false});
    }

    renderPosts(posts) {
        return posts.map(
            (post) => 
            <Col key={post.key} xs={12} sm={6}>
                <div className="card" style={{padding: "5px"}}>
                    <div className="card-image">
                        <Image placeholder={bgImg} src={post.url} transition="all 1s linear" />
                    </div>
                </div>
            </Col>
        )
    }

    render() {
        return (
            <div>
                <Row>
                    {this.state.posts && this.renderPosts(this.state.posts)}
                </Row>
            </div>
        );
    }

}