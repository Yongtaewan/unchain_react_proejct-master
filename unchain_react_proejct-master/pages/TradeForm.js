import React, { useCallback, useEffect, useState } from 'react';
import styled from "styled-components";

const Trade_Board = styled.div`
    background-color: gray;
    grid-column : -1/1;

`;
const Trade_Form = styled.div`
    width : 100%;
    height : 300px;
    grid-template-columns: 1fr 1fr;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const PurchaseCoin = styled.div`
    width : 50%;
    height : 100%;
    display: grid;
    float : left;
    background-color : tomato;
    align-items: center;
    justify-content: center;
    text-align : center;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`
const SellCoin = styled.div`
    width : 50%;
    height : 100%;
    display: grid;
    background-color : cornflowerblue;
    float : right;
    align-items: center;
    justify-content: center;
    text-align : center;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`
const UserMoney = styled.div`
`
const BuyPrice = styled.div`
`
const BuyAmount = styled.div`
`
const TotalBuyPrice = styled.div`
`

const SellPrice = styled.div`
`
const SellAmount = styled.div`
`
const TotalSellPrice = styled.div`
`
function TradeForm(){
    return(
    <Trade_Board>
        <Trade_Form>
            <PurchaseCoin>
                <UserMoney>보유 원화</UserMoney>
                <BuyPrice>매수 금액</BuyPrice>
                <BuyAmount>매수 수량</BuyAmount>
                <TotalBuyPrice>총 금액</TotalBuyPrice>
                <button> 매수 </button>
            </PurchaseCoin>
            <SellCoin>
                <UserMoney>보유 원화</UserMoney>
                <SellPrice>매도 금액</SellPrice>
                <SellAmount>매도 수량</SellAmount>
                <TotalSellPrice>총 금액</TotalSellPrice>
                <button> 매도 </button>
            </SellCoin>
        </Trade_Form>
    </Trade_Board>
    );
}

export default React.memo(TradeForm);