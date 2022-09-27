import 'bootstrap/dist/css/bootstrap.css'
import NavigationBar from '../components/NavigationBar'
import { useFetchMarketCode } from "use-upbit-api"
import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'
import {Provider, useDispatch} from 'react-redux';
import {configureStore, combineReducers} from 'redux';
import rootReducer from '../pages/_reducers'

function MyApp({ Component, pageProps }) {
  const { isLoading, marketCodes } = useFetchMarketCode();
  const Reducer = rootReducer;
  
  return (
    <>
    
    <Head><title>언체인 - TDC를 통한 정보 공유의 장</title></Head>
    <RecoilRoot>
    
      <NavigationBar />
      <Component {...pageProps} />
      
    </RecoilRoot>
    
    </>
  )
}

export default MyApp
