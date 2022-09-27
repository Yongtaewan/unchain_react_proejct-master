import React, {memo, useEffect, useState } from 'react';
import styled from "styled-components";
import CoinListBox from './CoinInfo';
import TradingViewWidget from '../components/MainPage/TradingViewWidget';
import Head from 'next/head'

const DisplayBoard = styled.main`
  width: 1650px;
  height: 1000px;
  margin: auto;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  background-color: whitesmoke;
  font-family: Arial, Helvetica, sans-serif;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  align-items: center;
  justify-content: center;
  &:nth-child(1){
    
  }
`;

const DetailLayout = styled.div`
  height: 500px;
  background-color: whitesmoke;
  padding: 5px;
  display: grid;
  margin : 10px 10px;
  gap: 5px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
`;

// align-items: center; : 세로 가운데 정렬
// justify-content: center; : 가로 가운데 정렬

function trends(){
	return (
    <>
    <Head><title>코인 동향 | 언체인</title></Head>
		<DisplayBoard>
			<DetailLayout>
          <div id="stochastic_img">
            stochastic img
          </div>
          <div id="rsi_img">
            rsi img
          </div>
          <div id="bit_graph">
            bit img
          </div>
          <div id="eth_graph">
            eth img
          </div>
        <TradingViewWidget/>
        <div id="feer_greed">
          공포 탐욕지수
        </div>
        <style jsx>{`
          #stochastic_img{
            text-align : center;
            width : 400px;
            height : 400px;
            display : inline-block;
            border : solid black 2px;
            margin : 0 auto;
            margin-bottom : 70px;
            padding : auto;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            background: url('/stochastic_graph.png');
            background-size: 100% 100%;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          #stochastic_img:hover{
            transform:scale(1.3);
          }
          #rsi_img {
            width : 400px;
            height : 400px;
            text-align : center;
            display : inline-block;
            border : solid black 2px;
            margin : auto 0;
            margin-bottom : 70px;
            padding : auto;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            background: url('/rsi_graph.png');
            background-size: 100% 100%;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          #rsi_img:hover{
            transform:scale(1.3);
          }
          #bit_graph {
            width : 400px;
            height : 400px;
            text-align : center;
            display : inline-block;
            border : solid black 2px;
            margin : auto 0;
            margin-bottom : 70px;
            padding : auto;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            background: url('/비트코인_2022-09-20.png');
            background-size: 100% 100%;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          #bit_graph:hover{
            transform:scale(1.3);
          }
          #eth_graph {
            width : 400px;
            height : 400px;
            text-align : center;
            display : inline-block;
            border : solid black 2px;
            margin : auto 0;
            margin-bottom : 70px;
            padding : auto;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            background: url('/이더리움_2022-09-20.png');
            background-size: 100% 100%;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          #eth_graph:hover{
            transform:scale(1.3);
          }
          #feer_greed {
            width : 400px;
            height : 400px;
            text-align : center;
            display : inline-block;
            border : solid black 2px;
            margin : auto 0;
            padding : auto;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            background: url("https://alternative.me/crypto/fear-and-greed-index.png");
            background-size: 100% 100%;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          #feer_greed:hover{
            transform:scale(1.3);
          }
        `}</style>
			</DetailLayout>
		</DisplayBoard>
    </>
	)
}


export default memo(trends);