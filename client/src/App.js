import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './User/Login';
import SignUp from './User/SignUp';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './App.css';

var axios = require('axios');

class App extends Component {
 
    constructor() {
      super();
      this.state = {
        user:null
      }
      this.submitSignup = this.submitSignup.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
      this.logout = this.logout.bind(this);
    }
  
    submitSignup(signupObj) {
      console.log("running signup")
      return new Promise((resolve, reject)=>{
        var url = '/signup';
        axios.post(url, {
                firstName: signupObj.firstName,
                lastName: signupObj.lastName,
                email: signupObj.email,
                password: signupObj.password
              }).then((userObj) => {
                 if (userObj) { 
                  this.setState({
                    user:userObj.data
                  }, ()=>{ console.log(this.state.user)}); 
                   resolve();
                  } else {
                  reject();
            }
        }); 
      })
    }
  
    logout(){
      return new Promise((resolve, reject)=>{
        axios.post('/logout').then((res)=>{
          if (res.error){
            reject(res.error);
          } else {
            resolve(res);
          }
        });
      });
    }
  
    submitLogin(loginObj) {
      return new Promise((resolve, reject)=>{
        var url = '/login'; 
          axios.post(url, {
            username: loginObj.username,
            password: loginObj.password
        }).then((userObj) => {
          if (userObj) { 
            axios.get('/user').then((res)=>{
                this.setState({
                  user:res.data
                })
                resolve();
            });
          }else{
            console.log(userObj);
            reject();
          }
        }); 
      }
    )};

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Router>
          <div> 
          <div className="container">
            <Route path='/login' render={() => <Login history={this.props.history} submitLogin={this.submitLogin} />} />
            <Route path='/signup' render={() => <SignUp submitSignup={this.submitSignup} />} />
          </div> 
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
