import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import CategoryPage from './components/CategoryPage'
import PostPage from './components/PostPage'

import {getPosts, getCategories} from './utils/api'
import {initPost} from './actions/PostActions'
import {initCategories} from "./actions/CategoryAction";

class App extends Component {

  constructor(props) {
    super(props);

    //获取初始化数据，并存储于store
    getPosts().then(data => window.store.dispatch(initPost(data)));
    getCategories().then(data => window.store.dispatch(initCategories(data)));
  }

  render() {
    return (
      <div className="App">

        <Route path='/' component={Header}/>

        <Route exact path="/" component={HomePage}/>

        <Route exact path="/:category" component={CategoryPage}/>

        <Route exact path="/:category/:postId" component={PostPage}/>

      </div>
    );
  }
}

export default App;
