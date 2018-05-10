import React, { Component } from 'react';
import logo from './hydroLogo.svg';
import './App.css';

const raindrop = require('@hydrogenplatform/raindrop')
const JsonTable = require('ts-react-json-table');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internalUsername: localStorage.getItem('internalUsername') || 'TestUser',
      raindropEnabled: false,
      hydroUsernameConfirmed: false,
      linkedHydroUsername: null,
      claimedHydroUsername: '',
      verificationMessage: raindrop.client.generateMessage(),
      messageToSign: raindrop.client.generateMessage(),
      database: [{}]
    };

    this.registerUser = this.registerUser.bind(this);
    this.unregisterUser = this.unregisterUser.bind(this);
    this.verify = this.verify.bind(this);
    this.internalUsernameChange = this.internalUsernameChange.bind(this);
    this.claimedHydroUsernameChange = this.claimedHydroUsernameChange.bind(this);
    this.refreshDatabase = this.refreshDatabase.bind(this);
    this.deleteDatabase = this.deleteDatabase.bind(this);
    this.getLinkedHydroUsername(this.state.internalUsername);
  }

  usernameStatus = () => {
    if (this.state.raindropEnabled && this.state.hydroUsernameConfirmed) {
      return (
        <div>
          Your account <strong>does</strong> have Raindrop 2FA enabled, and it is <strong>confirmed</strong>.
          <br/>
          Your Hydro username is saved as: <strong>{this.state.linkedHydroUsername}</strong>.
          <br/>
          <br/>
          <form onSubmit={this.unregisterUser}>
            <input type="submit" value=" Unregister " />
          </form>
        </div>
      )
    } else if (this.state.raindropEnabled && !this.state.hydroUsernameConfirmed) {
        return (
          <div>
            Your account <strong>does</strong> have Raindrop 2FA enabled, but it is <strong>unconfirmed</strong>.
            <br/>
            Your Hydro username is saved as: <strong>{this.state.linkedHydroUsername}</strong>.
            <br/>
            <br/>
            <form onSubmit={this.unregisterUser}>
              <input type="submit" value=" Unregister " />
            </form>
          </div>
        )
    } else {
      return (
        <div>
          Your account <strong>does not</strong> have Raindrop 2FA enabled.
        </div>
      )
    }
  }

  claimedHydroUsernameChange(event) {
    this.setState({claimedHydroUsername: event.target.value});
  }

  body = () => {
    if (!this.state.raindropEnabled || !this.state.hydroUsernameConfirmed) {
      return (
        <div>
          <h2>First Time Sign-Up</h2>
            <p className="text">
              Enter your Hydro username, visible in the Hydro mobile app.
            </p>
            <br/>
            <form onSubmit={this.registerUser}>
              <label>
                Hydro Username: <input type="text" value={this.state.claimedHydroUsername} onChange={this.claimedHydroUsernameChange} />
              </label>
              <input type="submit" value=" Link " />
            </form>
            <br/>
            <div className="result-box">
              {this.state.signUpStatus}
            </div>
            <br/>
            <p className="text">Complete first-time verification by entering the code below into the Hydro mobile app.</p>
            <p><font size="+3">{this.state.verificationMessage}</font></p>
            <form onSubmit={(e) => this.verify(e, this.state.verificationMessage, "firstTimeVerificationStatus")}>
              <input type="submit" value=" Authenticate " />
            </form>
            <br/>
            <div className="result-box">
              {this.state.firstTimeVerificationStatus}
            </div>
            <br/>
          </div>
        )
    } else {
      return (
        <div>
          <h2>Authentication</h2>
          <p className="text">Enter the code below into the Hydro mobile app</p>
          <p><font size="+3">{this.state.messageToSign}</font></p>
          <form onSubmit={(e) => this.verify(e, this.state.messageToSign, "verificationStatus")}>
            <input type="submit" value=" Authenticate " />
          </form>
          <br/>
          <div className="result-box">
            {this.state.verificationStatus}
          </div>
        </div>
      )
    }
  }

  refreshDatabase () {
    fetch('/getDatabase', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => { return response.json() })
      .then(data => {
        this.setState({database: data})
      })
      .catch(error => {
        console.log(error)
      });
  }

  deleteDatabase (event) {
    event.preventDefault();
    fetch('/deleteDatabase', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => { return response.json() })
      .then(data => {
        this.refreshDatabase()
      })
      .catch(error => {
        console.log(error)
      });
  }


  getLinkedHydroUsername (internalUsername) {
    this.refreshDatabase()
    fetch('/isInDatabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        internalUsername: internalUsername
      })
    })
      .then(response => { return response.json() })
      .then(data => {
        if (data.exists) {
          this.setState(
            {linkedHydroUsername: data.username, hydroUsernameConfirmed: data.confirmed, raindropEnabled: true}
          )
        } else {
          this.setState({linkedHydroUsername: null, hydroUsernameConfirmed: false, raindropEnabled: false})
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  internalUsernameChange (event) {
    this.setState({internalUsername: event.target.value});
    localStorage.setItem('internalUsername', event.target.value);
    this.getLinkedHydroUsername(event.target.value);
  }

  registerUser (event) {
    event.preventDefault();
    this.setState({signUpStatus: 'Loading...'})
    return fetch('/registerUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        internalUsername: this.state.internalUsername,
        hydroUsername: this.state.claimedHydroUsername
      })
    })
      .then(response => { return response.json() })
      .then(data => {
        if (data.registered) {
          this.setState({signUpStatus: 'Successful link, proceed to verification'})
          this.getLinkedHydroUsername(this.state.internalUsername);
        } else {
          this.setState({signUpStatus: 'Unsuccessful link (check backend logs)'})
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({signUpStatus: 'Error (check frontend logs)'})
      });
  };

  unregisterUser (event) {
    event.preventDefault();
    return fetch('/unregisterUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        hydroUsername: this.state.claimedHydroUsername
      })
    })
      .then(() => {
        this.getLinkedHydroUsername(this.state.internalUsername);
      })
      .catch(error => {
        console.log(error)
      });
  };

  verify (event, message, updateField) {
    event.preventDefault();
    this.setState({[updateField]: 'Loading...'})
    return fetch(`/verifySignature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // we only need to pass the user's internal identifier, their hydro username is already stored in the backend
      body: JSON.stringify({message: message, internalUsername: this.state.internalUsername})
    })
      .then(response => { return response.json() })
      .then(data => {
        if (data.verified) {
          if (updateField === "firstTimeVerificationStatus") {
            this.setState({[updateField]: 'Success! Redirecting, please wait...'})
            setTimeout(() => {
              this.getLinkedHydroUsername(this.state.internalUsername)
              this.setState({
                signUpStatus: "", firstTimeVerificationStatus: "", verificationStatus: "", claimedHydroUsername: ""
              })
            }, 4000)
          } else {
            this.setState({[updateField]: 'Success!'})
          }
        } else {
          this.setState({[updateField]: 'Failure (check backend logs)'})
        }
      })
      .catch(error => {
        this.setState({[updateField]: 'Error (check frontend logs)'})
        console.log(error)
      });
  };

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <br/>
        <hr color="black"></hr>
        <h1>Client-Side Raindrop Demo</h1>
        <label>Internal Username: </label><input type="text" value={this.state.internalUsername} onChange={this.internalUsernameChange} />
        {this.usernameStatus()}
        <br/>
        <hr color="black"></hr>
        {this.body()}
        <br/>
        <hr color="black"></hr>
        <h2>Database</h2>
        <form onSubmit={this.deleteDatabase}>
          <input type="submit" value=" Reset Database " />
        </form>
        <JsonTable className='table' rows = {this.state.database} />
      </div>
    );
  }
}

export default App;
