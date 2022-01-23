import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';


ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}> {/* <Provider> component makes the Redux store available  */}
      <App/>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);


