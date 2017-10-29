import React, { Component } from 'react'; 
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import {
  Redirect
} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
class SignUp extends Component{
  constructor() {
    super();
    this.inputfirstNameChange = this.inputfirstNameChange.bind(this);
    this.inputlastNameChange = this.inputlastNameChange.bind(this);
    this.inputemailChange = this.inputemailChange.bind(this);
    this.inputpasswordChange = this.inputpasswordChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      message: ''
    }
  }
//submitSignup() is in App.js
  handleSignup() {
    // this makes an obj to retun  
    this.props.submitSignup({
      firstName: this.state.firstName,      
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    }).then(()=>{
   this.props.history.push("/");
    });
  }
  inputfirstNameChange(event) {
    this.setState({firstName: event.target.value});
  }
  inputlastNameChange(event) {
    this.setState({lastName: event.target.value});
  }
  inputemailChange(event) {
    this.setState({email: event.target.value});
  }
  inputpasswordChange(event) {
    this.setState({password: event.target.value});
  }
  render(){ 
    return(
      <div>
        <h1 className="mb-3">Signup</h1>
        {this.state.message}
        <FormGroup>
          <Label for="firstName">First Name</Label>{' '}
          <Input type="text" onChange={this.inputfirstNameChange} value={this.state.firstName} name="firstName" id="firstName" />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Last Name</Label>{' '}
          <Input type="text" onChange={this.inputlastNameChange} value={this.state.lastName} name="lastName" id="lastName" />
        </FormGroup>
        <FormGroup>
        <Label for="email">Email</Label>{' '}
        <Input type="email" onChange={this.inputemailChange} value={this.state.email} name="email" id="email" placeholder="you@something.com" />
      </FormGroup>
        {' '}
        <FormGroup>
          <Label for="password">Password</Label>{' '}
          <Input type="password" onChange={this.inputpasswordChange} value={this.state.password} name="password" id="password"  />
        </FormGroup>
        {' '}
         <Button onClick={this.handleSignup}>Submit</Button> 
      </div>
    );
  };
}

export default withRouter(SignUp);