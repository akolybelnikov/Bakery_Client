import React from "react";
import config from "../config";
import axios from "axios";
import { Card, notification } from 'antd';
import ProgressiveImage from 'react-progressive-bg-image';
import styled, { keyframes } from 'styled-components';
import { zoomIn } from "react-animations";
import localforage from 'localforage';

const zoomInAnimation = keyframes`${zoomIn}`;

const Instacard = styled(Card)`
  animation: 2s ${zoomInAnimation};
`
const PostCard = styled.div`
    
`
const PostsRow = styled.div`
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    @media screen and (max-width: 320px) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr); 
    }
    @media only screen and (min-width: 321px) and (max-width: 480px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(2, 1fr); 
    } 
`

const Image = styled(ProgressiveImage)`
    min-height: 150px;
    background-size: contain;
    background-position: center center;
    @media only screen and (max-width: 1300px) {
        min-height: 175px;
    }
    @media only screen and (min-width: 321px) and (max-width: 480px) {
        min-height: 150px;
    } 
    @media screen and (max-width: 320px) {
        min-height: 300px;
        background-size: cover;
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
           const posts = await this.fetchPosts();
           this.setState({ posts: posts});                      
       } catch (e) {
            console.error(e);
       }

       this.setState({ loading: false});
    }

    async fetchPosts() {
        try {
            const posts = await localforage.getItem('posts');
            if (posts && posts[0].date <= new Date()) {
                return posts;
            } else {
                const fetchedPosts = await this.getInstagramData();
                await localforage.setItem('posts', fetchedPosts);
                return fetchedPosts;
            }

        } catch (e) { 
            this.openErrorNotification();
        }
    }

    async getInstagramData() {
        try {
            const results = await axios.get(`https://api.instagram.com/v1/users/${config.instagram.REACT_APP_INSTAGRAM_USER_ID_0}/media/recent/?access_token=${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN_0}&&count=4`);

            const responsePosts = results.data.data;
            for (let i = 0; i < responsePosts.length; i++)  {
                responsePosts[i]['key'] = i;
                responsePosts[i]['date'] = new Date();
            }

            return responsePosts;

        } catch (e) {
            try {
                const replaceResults = await axios.get(`https://api.instagram.com/v1/users/${config.instagram.REACT_APP_INSTAGRAM_USER_ID_1}/media/recent/?access_token=${config.instagram.REACT_APP_INSTAGRAM_ACCESS_TOKEN_1}&&count=4`);

                const replacePosts = replaceResults.data.data;
                for (let i = 0; i < replacePosts.length; i++) {
                    replacePosts[i]['key'] = i;
                    replacePosts[i]['date'] = new Date();
                }
                return replacePosts;            

            } catch (e) {
                this.openErrorNotification();
            }

        }
    }

    openErrorNotification() {
        notification["error"]({
          message: "Произошла ошибка при загрузке!",
          description: "Пожалуйста, попробуйте загрузить приложение ещё раз."
        });
      }

    renderPosts(posts) {
        return posts.map(
            (post) => 
            <PostCard key={post.key}>
                <a href={post.link} target='_blank' rel="noopener noreferrer" className="card-image">
                    <Card 
                        cover={<Image placeholder={bgImg} src={post.images.low_resolution.url} transition="all 1s linear" /> }
                        actions={[<p className="is-size-7-mobile is-size-6-tablet" style={{color: '#331507', wordBreak: "break-word"}}>{post.caption && post.caption.text.substring(0, 120)} ... </p>]}>
                    </Card>
                </a>
            </PostCard>
        )
    }

    render() {
        return (
            <div className="tile is-vertical is-parent">
                <article className="tile is-child box">           
                    <Instacard title={<a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/confertru.ru">Мы на Instagram</a>} bordered="true">
                        <PostsRow>
                            {this.state.posts && this.renderPosts(this.state.posts)}
                        </PostsRow>                             
                    </Instacard>   
                </article>
            </div>
        );
    }

}