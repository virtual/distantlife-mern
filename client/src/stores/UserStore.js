import {extendObservable} from 'mobx';
var axios = require('axios');

export default class UserStore { // do all store stuff
  constructor() {
    extendObservable(this, {
      // object where all observables exist
      user:{
        firstName: null,
        lastName: null,
        email: null,
        img: null,
        password: null, 
      },     
        get retrieveUser() {
         return this.user
      }
    });
    // always gets run, not called
    axios.get('/user').then((success)=>{
      this.user = success.data.user //when updated all observers will rerender comps
    })

    // login

    // logout

    // signup
  } 
}