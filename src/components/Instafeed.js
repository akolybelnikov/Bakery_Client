import React from "react";
import config from "../config";
import axios from "axios";
import { Row, Col, Card } from 'antd';
import ProgressiveImage from 'react-progressive-bg-image';
import styled, { keyframes } from 'styled-components';
import { zoomIn } from "react-animations";

const zoomInAnimation = keyframes`${zoomIn}`;

const Instacard = styled(Card)`
  animation: 2s ${zoomInAnimation};
`

const Image = styled(ProgressiveImage)`
    min-height: 150px;
    background-size: cover;
    background-position: center top;
    @media only screen and (max-width: 1300px) {
        min-height: 175px;
    }
    @media only screen and (max-width: 480px) {
        min-height: 150px;
    } 
`
const bgImg = require(`../public/logo.png`);

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
           await axios.get(`https://api.instagram.com/v1/users/${config.instagram.REACT_APP_INSTAGRAM_USER_ID_0}/media/recent/?access_token=${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN_0}&&count=4`)
                .then(res => {
                    const posts = res.data.data;
                    for (let i = 0; i < posts.length; i++) {
                        posts[i]['key'] = i;
                    }
                    this.setState({ posts: posts});                
                });         

       } catch (e) {
            try {
                    await axios.get(`https://api.instagram.com/v1/users/${config.instagram.REACT_APP_INSTAGRAM_USER_ID_1}/media/recent/?access_token=${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN_1}&&count=4`)
                    .then(res => {
                        const posts = res.data.data;
                        for (let i = 0; i < posts.length; i++) {
                            posts[i]['key'] = i;
                        }
                        this.setState({ posts: posts});               
                    });

            } catch (e) {
                    console.log(e);
            }
       }

       this.setState({ loading: false});
    }

    renderPosts(posts) {
        return posts.map(
            (post) => 
            <Col key={post.key} xs={12} md={6}>
                <a href={post.link} target='_blank' rel="noopener noreferrer" className="card-image">
                    <Card 
                        cover={<Image placeholder={bgImg} src={post.images.low_resolution.url} transition="all 1s linear" /> }
                        actions={[<p className="is-size-7-mobile is-size-6-tablet" style={{color: '#331507'}}>{post.caption.text.substring(0, 75)} ... </p>]}>
                    </Card>
                </a>
            </Col>
        )
    }

    render() {
        return (
            <div className="tile is-vertical is-parent">
                <article className="tile is-child box">              
                    <Instacard title="Мы на Instagram" bordered="true">
                        <Row>
                            {this.state.posts && this.renderPosts(this.state.posts)}
                        </Row>                             
                    </Instacard>   
                </article>
            </div>
        );
    }

}