import React from "react";
import ReactDOM from "react-dom";
import Eaxios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";

const Welcome = ({ user, token, onSignOut }) => {
  // This is a dumb "stateless" component
  return (
    <div>
      Welcome <strong>{user.username}</strong>! <br />
      <br />
      <p>{JSON.stringify(user)}</p> <br />
      <br />
      <p>Token : {token} </p>
      <a href="javascript:;" onClick={onSignOut}>
        Sign out
      </a>
    </div>
  );
};
const ErrMesg = ({ errmsg }) => {
  // This is a dumb "stateless" component
  return (
    <div>
      <strong>{errmsg}</strong>! <br />
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
    let eml = this.refs.eml.value;
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    this.props.onSignUp(eml, username, password);
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
          <input type="text" ref="eml" placeholder="Email ID" />
          <input type="text" ref="username" placeholder="enter you username" />
          <input type="password" ref="password" placeholder="enter password" />
          <input type="submit" value="Sign up" />
        </form>
        <ErrMesg errmsg={this.props.errmsg} />
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    // the initial application state
    this.state = {
      user: null,
      tokend: null,
      errmsg: "All fields are required for Sign up"
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
    //this.state.ldata = lldata;
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    console.log("Ldata: ", JSON.stringify(lldata));
    loadProgressBar();
    Eaxios.post(
      "https://eventmanagerapi.herokuapp.com/api/Users/login",
      lldata,
      axiosConfig
    )
      .then(res => {
        console.log("RESPONSE RECEIVED: ", res);
        this.setState(state => ({ tokend: res.data.id }));
        console.log("Token: ", this.state.tokend);
        let getUserURL =
          "https://eventmanagerapi.herokuapp.com/api/Users/" +
          res.data.userId +
          "?access_token=" +
          this.state.tokend;
        Eaxios.get(getUserURL, axiosConfig)
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
            console.log(err.response.data.error.statuscode);
            let errmsgobj = JSON.stringify(err.response.data.error.statusCode);
            let mesg = "";
            if (errmsgobj === "401") {
              mesg = "Login Failed. Username or password incorrect";
            }
            console.log(mesg);
            this.setState(state => ({
              errmsg: mesg
            }));
          });
      })
      .catch(err => {
        console.log("AXIOS ERROR: ", err);
        console.log(err.response.data.error.statuscode);
        let errmsgobj = JSON.stringify(err.response.data.error.statusCode);
        let mesg = "";
        if (errmsgobj === "401") {
          mesg = "Login Failed. Username or password incorrect";
        }
        console.log(mesg);
        this.setState(state => ({
          errmsg: mesg
        }));
      });
  }
  signUp(eml, username, password) {
    // This is where you would call Firebase, an API etc...
    // calling setState will re-render the entire app (efficiently!)
    console.log("Form data: ", eml + username + password);
    let ssdata = {
      realm: "EM",
      username: username,
      email: eml,
      password: password,
      emailVerified: false
    };
    let ltdata = {
      username: username,
      password: password
    };
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    console.log("ssdata: ", JSON.stringify(ssdata));
    loadProgressBar();
    Eaxios.post(
      "https://eventmanagerapi.herokuapp.com/api/Users",
      ssdata,
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
        Eaxios.post(
          "https://eventmanagerapi.herokuapp.com/api/Users/login",
          ltdata,
          axiosConfig
        )
          .then(res => {
            console.log("RESPONSE RECEIVED: ", res);
            this.setState(state => ({ tokend: res.data.id }));
            console.log("Token: ", this.state.tokend);
          })
          .catch(err => {
            console.log(
              "AXIOS ERROR: ",
              JSON.stringify(err.response.data.error.details.messages)
            );
            let errmsgobj = err.response.data.error.details.messages;
            let x = null;
            var mesg;
            for (x in errmsgobj) {
              mesg += errmsgobj[x][0] + " ";
            }
            console.log(mesg);
            this.setState(state => ({
              errmsg: mesg
            }));
          });
      })
      .catch(err => {
        console.log(
          "AXIOS ERROR: ",
          JSON.stringify(err.response.data.error.details.messages)
        );
        let errmsgobj = err.response.data.error.details.messages;
        let x = null;
        var mesg;
        for (x in errmsgobj) {
          mesg += errmsgobj[x][0] + " ";
        }
        console.log(mesg);
        this.setState(state => ({
          errmsg: mesg
        }));
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
          <Welcome
            user={this.state.user}
            token={this.state.tokend}
            onSignOut={this.signOut.bind(this)}
          />
        ) : (
          <LoginForm
            onSignIn={this.signIn.bind(this)}
            onSignUp={this.signUp.bind(this)}
            errmsg={this.state.errmsg}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
