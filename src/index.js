import React from "react";
import ReactDOM from "react-dom";
import Eaxios from "axios";
const Welcome = ({ user, onSignOut }) => {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.username}</strong>! <br />
      <br />
      <p>{JSON.stringify(user)}</p>
      <a href="javascript:;" onClick={onSignOut}>
        Sign out
      </a>
    </div>
  );
};

class LoginForm extends React.Component {
  // Using a class based component here because we're accessing DOM refs

  handleSignIn(e) {
    e.preventDefault();
    let uname = this.refs.uname.value;
    let pwd = this.refs.pwd.value;
    this.props.onSignIn(uname, pwd);
  }
  handleSignUp(e) {
    e.preventDefault();
    let email = this.refs.email.value;
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    this.props.onSignUp(email, username, password);
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSignIn.bind(this)}>
          <h3>Sign in</h3>
          <input type="text" ref="uname" placeholder="enter you username" />
          <input type="password" ref="pwd" placeholder="enter password" />
          <input type="submit" value="Login" />
        </form>
        <h1>New User ?</h1>
        <form onSubmit={this.handleSignUp.bind(this)}>
          <h3>Sign Up</h3>
          <input type="text" ref="email" placeholder="Email ID" />
          <input type="text" ref="username" placeholder="enter you username" />
          <input type="password" ref="password" placeholder="enter password" />
          <input type="submit" value="Sign up" />
        </form>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    // the initial application state
    this.state = {
      sdata: null,
      ldata: null,
      user: null,
      tokend: null
    };
  }

  // App "actions" (functions that modify state)
  signIn(uname, pwd) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    console.log("Form data: ", uname + pwd);

    let lldata = {
      username: uname,
      password: pwd
    };
    this.setState(state => ({ ldata: lldata }));
    //this.state.ldata = lldata;
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    console.log("Ldata: ", JSON.stringify(this.state.ldata));
    Eaxios.post(
      "https://eventmanagerapi.herokuapp.com/api/Users/login",
      this.state.ldata,
      axiosConfig
    )
      .then(res => {
        console.log("RESPONSE RECEIVED: ", res);
        this.setState({
          user: res.data
        });
        this.setState(state => ({ tokend: res.data.id }));
        let getUserURL =
          "https://eventmanagerapi.herokuapp.com/api/Users/" + res.data.userId;
        Eaxios.post(getUserURL, this.state.tokend, axiosConfig)
          .then(res => {
            console.log("RESPONSE RECEIVED: ", res);
            this.setState({
              user: {
                realm: res.data.realm,
                username: res.data.username,
                email: res.data.email,
                emailVerified: false,
                userId: res.data.id
              }
            });
          })
          .catch(err => {
            console.log("AXIOS ERROR: ", err);
          });
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
      });
  }
  signUp(email, username, password) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    let ssdata: {
      realm: "EM",
      username: username,
      email: email,
      password: password,
      emailVerified: false
    };

    this.setState(state => ({ sdata: ssdata }));
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };

    Eaxios.post(
      "https://eventmanagerapi.herokuapp.com/api/Users",
      this.state.sdata,
      axiosConfig
    )
      .then(res => {
        console.log("RESPONSE RECEIVED: ", res);
        this.setState({
          user: {
            realm: res.data.realm,
            username: res.data.username,
            email: res.data.email,
            emailVerified: false,
            userId: res.data.id
          }
        });
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
      });
  }
  signOut() {
    // clear out user from state
    this.setState({ user: null });
  }

  render() {
    // Here we pass relevant state to our child components
    // as props. Note that functions are passed using `bind` to
    // make sure we keep our scope to App
    return (
      <div>
        <h1>Event Manager</h1>
        {this.state.user ? (
          <Welcome user={this.state.user} onSignOut={this.signOut.bind(this)} />
        ) : (
          <LoginForm
            onSignIn={this.signIn.bind(this)}
            onSignUp={this.signUp.bind(this)}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
