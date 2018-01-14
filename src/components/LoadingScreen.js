import React from "react";
import styled from 'styled-components';
import { Spin } from 'antd';

const Loader = styled.div`
    margin: 0 auto;
    padding-top: 25%;
    @media only screen and (max-width: 768px) {
        padding-top: 35%;
    }
`

const Text = styled.div`
    margin: 0 auto;
    text-align: center;
    color: #52082D;
    display: block;
    @media only screen and (max-width: 768px) {
        font-size: 14px;
    }
    @media only screen and (min-width: 769px) {
        font-size: 18px;
    }
`

export default class LoadingScreen extends React.Component {

    render() {
        return (
            <Loader>
                <Spin style={{display: 'block', marginTop: '45px'}} size="large">
                <Text><p>Подождите немного, идёт загрузка ....</p></Text></Spin>                
            </Loader>
        );
    }

}