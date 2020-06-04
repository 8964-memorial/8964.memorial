import React from 'react';
//import logo from './logo.svg';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/database";

import { v4 as uuidv4 } from 'uuid';
import candle from "./assets/candlegif3.gif";

import firebaseConfig from './config/config.json';

firebase.initializeApp(firebaseConfig);

const writeUserData = (name, comments) => {
  firebase.database().ref('users/' + uuidv4()).set({
    username: name,
    comments: comments,
    timestamp: Date.now()
  });
}

const candlesRef = firebase.database().ref('users/');



class Candle extends React.Component {

 render() {
   let { name, comments } = this.props;
   return (
    <div key={comments} style={{marginRight: (Math.round(Math.random() * 80) + 10), marginBottom: (Math.round(Math.random() * 100))}} >
      <div className="box" style={{marginRight: (Math.round(Math.random() * 30) + 10), marginBottom: (Math.round(Math.random() * 100))}}>
        <img src={candle} /><div className="box-content">{name}<br/>{comments}</div>
      </div>
    </div>
     )
 }
}

class Vigil extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
     totalCandles: [],
     loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    candlesRef.on('value', (snapshot) => {
      this.setState({ loading: false });
      console.log('loaded!')
      let values = snapshot.val();
      this.setState({ totalCandles: Object.keys(values).map(a => values[a]) });
      console.log(this.state);
    });
  }

  componentWillUnmount() {
    candlesRef.off();
  }

 render() {
   return (
    <div id="content">
      {this.state.totalCandles.map(e => <Candle name={e.username} comments={e.comments} />)}
    </div>
     )
 }
}

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     name: '匿名',
     comments: ''
    };
  }

  onNameInput = (e) => {
   this.setState({name: e.target.value});
  }

  onCommentInput = (e) => {
   this.setState({comments: e.target.value});
  }


   onSubmit = (e) => {
     // console.log(e.key);
      const { name, comments } = this.state;
      if (comments) {
        writeUserData(name, comments);
        document.cookie = "vigil=lighted";
        this.props.onDirty();
      } else {
        alert('你好像忘了留言喔～');
      }


   }


 render() {
   return (
      <form className="form">
         <div className="button" onClick={this.onSubmit}>按我點燈{this.state.dirty}</div>
        <input type="text" name="name" onKeyDown={this.onNameInput} />
        <textarea name="content" cols="30" rows="3" onKeyDown={this.onCommentInput}></textarea>
      </form>

     )
 }
}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     dirty: false
    };
  }

  componentDidMount() {
    let kookie = document.cookie.includes('vigil=lighted')

    if (kookie) {
      this.setState({ dirty: true });
    }
  }

  onDirty = () => {
    this.setState({ dirty: true });
  }

 render() {
   return (
    this.state.dirty ? <Vigil /> : <Form onDirty={this.onDirty} />
     )
 }
}



export default App;
