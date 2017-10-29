import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './User/Login';
import SignUp from './User/SignUp';
import Navbar from './Navbar/Navbar';
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
                  }); 
                   resolve(userObj.data);
                  } else {
                  reject();
            }
        }).catch(e => {
            console.log(e);
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
        }).catch(e => {
          console.log(e);
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
            if (userObj.data.success) { 
              axios.get('/user').then((res) => {
                this.setState({
                  user: res.data.user
                })
                resolve(res.data);
              }).catch(e => {
                console.log(e);
            });
            } else { 
              reject(userObj.data);
            }
          }).catch(e => {
            console.log(e);
        }); 
      }
    )};

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Navbar />
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>

            <div>
              <div className="container">
                <Route path='/login' render={() => <Login history={this.props.history} submitLogin={this.submitLogin} />} />
                <Route path='/signup' render={() => <SignUp submitSignup={this.submitSignup} />} />
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
