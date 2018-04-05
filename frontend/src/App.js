import React, { Component } from 'react';
import logo from './hydroLogo.svg';
import './App.css';

const raindrop = require('@hydrogenplatform/raindrop')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hydroUserName: '',
      signUpStatus: '\n',
      messageToSign: '',
      verificationStatus: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.firstTimeSignUp = this.firstTimeSignUp.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
    this.firstTimeVerification = this.firstTimeVerification.bind(this);
  }

  componentDidMount () {
      const script = document.createElement("script");

      script.src = `https://rawgit.com/NoahHydro/e7e9efd3a98c9393d20aa542a99b582f/raw/` +
                   `7c3e242d2ad6fd227e349baea198fa9132a92374/raindrop.js`;
      script.async = true;

      document.body.appendChild(script);
  }

  handleChange(event) {
    this.setState({hydroUserName: event.target.value});
  }

  firstTimeSignUp (event) {
    event.preventDefault();
    this.setState({signUpStatus: 'Loading...'})
    return fetch(`/registerUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({hydroUserName: this.state.hydroUserName})
    })
      .then(response => { return response.json() })
      .then(data => {
        if (data['userExists']) {
          this.setState({signUpStatus: 'Username found'})
        } else {
          this.setState({signUpStatus: 'Username not found, please try again'})
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({signUpStatus: 'Error, please try again'})
      });
  };

  firstTimeVerification (event) {
    event.preventDefault();
    this.setState({verificationStatus: 'Loading...'})
    return fetch(`/verifySignature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // once first-time verifiaction has gone through, sites will need to link the users' site-specific login to their
      // hydroUserName, which will need to be provided to the hydrogen API every time the user wants to use Hydro 2FA
      body: JSON.stringify({message: this.state.messageToSign, userName: this.state.hydroUserName})
    })
      .then(response => { return response.json() })
      .then(data => {
        if (data['verified']) {
          this.setState({verificationStatus: 'Message Verified √'})
        } else {
          this.setState({verificationStatus: 'Message Not Verified'})
        }
      })
      .catch(error => {
          this.setState({verificationStatus: 'Error, please try again'})
        console.log(error)
      });
  };

  generateMessage (event) {
    event.preventDefault();
    this.setState({messageToSign: raindrop.generateMessage()})
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Raindrop Two-Factor Authentication</h1>
        </header>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h1 className="App-title">First Time Sign-Up</h1>
        <form onSubmit={this.firstTimeSignUp}>
          <label>
            Hydro Username:
            <input type="text" value={this.state.userHydroUserName} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Link" />
        </form>
        <br></br>
        <div className="result-box">
          {this.state.signUpStatus}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h1 className="App-title">Subsequent Authentications</h1>
        <form onSubmit={this.generateMessage}>
          <input type="submit" value="Generate" />
        </form>
        <p>Please enter this code in your Hydro App: <i>{this.state.messageToSign}</i></p>
        <br></br>
        <div className="result-box">
          {this.state.verificationStatus}
        </div>
        <br></br>
        <form onSubmit={this.firstTimeVerification}>
          <input type="submit" value="Proceed" />
        </form>
      </div>
    );
  }
}

export default App;
