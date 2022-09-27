// src/index.js
import React from 'react';

import ReactDOM from 'react-dom';
import App from './_app';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
import MainBanner from '../components/MainPage/MainBanner'
import TradingViewWidget from '../components/MainPage/TradingViewWidget'
import * as serviceWorker from '../serviceWorker';


// 미들웨어를 적용한 redux store를 만드는 과정
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);
//const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(Reducer);

ReactDOM.render(
  <React.StrictMode>
    {/* Provider를 이용해 리덕스 적용 */}
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        {/* 크롬 브라우저에서 디버깅 도구를 이용할 수 있도록 하는 도구 */}
       , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      )}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
serviceWorker.unregister();



export default function Home() {
  return (
    <>
      <MainBanner />  
      <TradingViewWidget />
    </>
  )
}
