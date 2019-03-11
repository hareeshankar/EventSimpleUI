import React from "react";
import ReactDOM from "react-dom";
import Eaxios from "axios";
const Welcome = ({ user, onSignOut }) => {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.username}</strong>!
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
    let username = this.refs.uname.value;
    let password = this.refs.pwd.value;
    this.props.onSignIn(username, password);
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
        <form onSubmit={this.handleSignIn.bind(this)}>
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
      user: null
    };
  }

  // App "actions" (functions that modify state)
  signIn(username, password) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    this.setState({
      ldata: {
        username: username,
        password: password
      }
    });
  }
  signUp(email, username, password) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    this.setState({
      sdata: {
        realm: "EM",
        username: username,
        email: email,
        password: password,
        emailVerified: true
      }
    });

    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    };

    Eaxios.post('http://<host>:<port>/<path>', this.state.data, axiosConfig)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })


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
          <LoginForm onSignIn={this.signIn.bind(this)} onSignUp={this.signUp.bind(this)} />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
