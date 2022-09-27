import React, {memo, useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useFetchMarketCode } from "use-upbit-api";
import { useUpbitWebSocket } from "use-upbit-api";
import RealTimeChart from "./RealTimeChart";
import CoinInfo from "./CoinInfo";
import TradeForm from './TradeForm';
import PurchaseCoin from './PurchaseCoin';
import SellCoin from './SellCoin';
import Head from 'next/head'


import {
  marketCodesState,
  selectedCoinInfoState,
  selectedCoinState,
} from "../components/atom";
import RealTimeOrderBook from '../API_Check/src/QuotationAPI/TOTAL-example/RealTimeOrderBook';
import RealTimeTradeHistory from '../API_Check/src/QuotationAPI/TOTAL-example/RealTimeTradeHistory';

const convertMillonWon = (value) => {
  const MILLION = 1000000;
  const extractedValue = value / MILLION;
  return extractedValue;
};

const DisplayBoard = styled.main`
  width: 1250px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 950px 300px;
  background-color: whitesmoke;

  font-family: Arial, Helvetica, sans-serif;

  *::-webkit-scrollbar,
  *::-webkit-scrollbar-thumb {
    width: 0px;
  }

  *::-webkit-scrollbar-thumb {
  }
  *:hover::-webkit-scrollbar,
  *:hover::-webkit-scrollbar-thumb {
    width: 26px;
    border-radius: 13px;
    background-clip: padding-box;
    border: 12px solid transparent;
    color: grey;
  }

  *:hover::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 0 10px;
  }

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const CoinListBox = styled.div`
  height: 900px;
  margin: 5px;
  background-color: white;
  overflow: overlay;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const CoinBoxHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 1px;
  background-color: white;
  opacity: 0.8;
  height: 35px;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
  border-bottom: 0.5px solid lightgrey;
  font-size: 12px;
  font-weight: 600;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const CoinBox = styled.div`
  height: 45px;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
  border-bottom: 0.5px solid lightgrey;
  font-size: 12px;
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "lightgrey" : "inherit")};
  :hover {
    background-color: lightgrey;
  }
  div {
    display: flex;
  }
  div:nth-child(1) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  div:nth-child(2) {
    justify-content: flex-end;
    align-items: center;
  }
  div:nth-child(3) {
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
  div:nth-child(4) {
    justify-content: flex-end;
    align-items: center;
  }
`;

const CoinBoxName = styled.div`
  font-weight: 600;
  font-size: 11px;

  div:nth-child(2) {
    color: gray;
    font-weight: 400;
    font-size: 7px;
  }
`;

const CoinBoxPrice = styled.div`
  font-weight: 600;
  color: ${(props) => {
    switch (props.changeType) {
      case "RISE":
        return "#EF1C1C";
      case "EVEN":
        return "#000000";
      case "FALL":
        return "#1261C4";
      default:
        return "#000000";
    }
  }};
`;

const CoinBoxChange = styled.div`
  color: ${(props) => {
    switch (props.changeType) {
      case "RISE":
        return "#EF1C1C";
      case "EVEN":
        return "#000000";
      case "FALL":
        return "#1261C4";
      default:
        return "#000000";
    }
  }};
`;

const DetailLayout = styled.div`
  height: 900px;
  background-color: whitesmoke;
  padding: 5px;
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 1fr 1.1fr;
  grid-template-rows: 105px 300px 1fr;
`;

const CoinBoxChangeRate = styled.div``;
const CoinBoxChangePrice = styled.div``;
const CoinBoxVolume = styled.div`
  font-size: 11px;
  div:nth-child(2) {
    color: grey;
  }
`;

function App() {
  const [selectedCoin, setSelectedCoin] = useRecoilState(selectedCoinState);
  const [marketCodes, setMarketCodes] = useRecoilState(marketCodesState);
  const { isLoading, marketCodes: targetMarketCodes } = useFetchMarketCode();
  const option = { throttle_time: 400, max_length_queue: 100 };
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    marketCodes,
    "ticker",
    option
  );
  const [selectedCoinInfo, setSelectedCoinInfo] = useRecoilState(
    selectedCoinInfoState
  );

  useEffect(() => {
    if (socketData) {
      const targetData = socketData.filter(
        (data) => data.code == selectedCoin[0].market
      );
      setSelectedCoinInfo(...targetData);
    }
  } , [selectedCoin, socketData]);

  const clickCoinHandler = (evt) => {
    const currentTarget = marketCodes.filter(
      (code) => code.market === evt.currentTarget.id
    );
    setSelectedCoin(currentTarget);
  };

  useEffect(() =>{
    const MarketCodes_KRW = targetMarketCodes.filter((code)=>
      code.market.includes("KRW")
    );
    setMarketCodes(MarketCodes_KRW);
  }, [targetMarketCodes])

  return (
    <>
    <Head><title>Bitcoin Exchange | 언체인</title></Head>
    <DisplayBoard>
      <DetailLayout>
        <CoinInfo/>
        <RealTimeChart/>
        <RealTimeOrderBook/>
        <RealTimeTradeHistory/>
        <TradeForm/>
      </DetailLayout>
      <CoinListBox>
        <CoinBoxHeader>
          <div>코인</div>
          <div>현재가</div>
          <div>전일대비</div>
          <div>거래대금</div>
        </CoinBoxHeader>
        {socketData
          ? socketData.map((data) =>{
            return(
              <CoinBox
                key = {data.code}
                id = {data.code}
                onClick={clickCoinHandler}
                selected={selectedCoin[0].market === data.code}
              >
              <CoinBoxName>
                <div>
                  {
                    marketCodes.filter((code) => code.market === data.code)[0].korean_name
                  }
                </div>
                <div>
                  {
                    marketCodes.filter((code) => code.market === data.code)[0].market
                  }
                </div>
              </CoinBoxName>
              <CoinBoxPrice changeType = {data.change}>
                {data.trade_price.toLocaleString("ko-KR")}
              </CoinBoxPrice>
              <CoinBoxChange changeType={data.change}>
                <CoinBoxChangeRate>
                  {data.signed_change_rate > 0 ? "+" : null}
                  {(data.signed_change_rate * 100).toFixed(2)}%
                </CoinBoxChangeRate>
                <CoinBoxChangePrice>
                  {data.signed_change_price.toLocaleString("ko-KR")}
                </CoinBoxChangePrice>
              </CoinBoxChange>
              <CoinBoxVolume>
                <div>
                  {Math.ceil(
                    convertMillonWon(data.acc_trade_price_24h)
                  ).toLocaleString("ko-KR")}
                </div>
                <div>백만</div>
              </CoinBoxVolume>

              </CoinBox>
            );
          })
          : null}
      </CoinListBox>
    </DisplayBoard>
    </>
  )
}

export default memo(App);