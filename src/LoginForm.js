import React from "react";
import "axios-progress-bar/dist/nprogress.css";
import "materialize-css/dist/css/materialize.min.css";

const ErrMesg = ({ errmsg }) => {
  // This is a dumb "stateless" component
  return (
    <div className="white-text">
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
      <div className="row">
        <div className="row">
          <div
            className="center col s12"
            Style="display: inline-block; padding: 0px 48px 0px 48px; color: white;font-size: 24px;text-align:center;"
          >
            A One stop shop for managing any kind of Events.
            <br /> Create Event Details. Add Tasks to do.
            <br /> Track Transaction between vendors and much more.
          </div>
        </div>
        <div className="row">
          <div className="col s2" />
          <div className="container col s4 center">
            <div
              className="card blue-grey darken-1"
              Style="display: inline-block; padding: 0px 48px 0px 48px; border: 1px solid #EEE;"
            >
              <form onSubmit={this.handleSignIn.bind(this)}>
                <h2 className="center white-text">Sign in</h2>
                <input type="text" ref="uname" placeholder="Username" /> <br />
                <input type="password" ref="pwd" placeholder="Password" />
                <br />
                <div class="card-action">
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    value="Login"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="container col s4 center">
            <div
              className="card blue-grey darken-1"
              Style="display: inline-block; padding: 0px 48px 0px 48px; border: 1px solid #EEE;"
            >
              <form onSubmit={this.handleSignUp.bind(this)}>
                <h2 className="center white-text">Sign Up</h2>
                <input type="text" ref="eml" placeholder="Email ID" /> <br />
                <input type="text" ref="username" placeholder="Username" />{" "}
                <br />
                <input
                  type="password"
                  ref="password"
                  placeholder="Password"
                />{" "}
                <br />
                <div class="card-action">
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    value="Submit"
                  >
                    Submit
                  </button>
                </div>
                <ErrMesg errmsg={this.props.errmsg} />
              </form>
            </div>
            <div className="col s2" />
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
