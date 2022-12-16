import React, { useState } from 'react';
import client from './feathers';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  function updateField(cb) {
    return ev => {
      cb(ev.target.value);
    };
  }

  function login() {
    return client
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .catch(err => setError(err));
  }

  function signup() {
    return client
      .service('users')
      .create({ email, password })
      .then(() => login());
  }

  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            <fieldset>
              <input
                className="block"
                type="email"
                name="email"
                placeholder="email"
                onChange={updateField(setEmail)}
              />
            </fieldset>

            <fieldset>
              <input
                className="block"
                type="password"
                name="password"
                placeholder="password"
                onChange={updateField(setPassword)}
              />
            </fieldset>

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => login()}
            >
              Log in
            </button>

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => signup()}
            >
              Signup
            </button>
            <a class="button button-primary block" href="/oauth/github">
              Login with GitHub
            </a>            
            <a class="button button-primary block" href="http://localhost:3030/oauth/auth0">
              Login with Auth0
            </a>            
            {/* <a class="button button-primary block" href="http://localhost:3030/oauth/microsoft">
              Login with OAuth
            </a>            https://login.microsoftonline.com/5269b021-533e-4702-b9d9-72acbc852c97/oauth2/v2.0/authorize?client_id=29fa39d4-de57-4009-a46a-c561fa048562&response_type=code&redirect_uri=http%3A%2F%2Flocalhost&response_mode=query&scope=api%3A%2F%2F29fa39d4-de57-4009-a46a-c561fa048562%2FUser.Info&state=12345 */}
            {/* <a class="button button-primary block" href="https://login.microsoftonline.com/5269b021-533e-4702-b9d9-72acbc852c97/oauth2/v2.0/authorize?client_id=29fa39d4-de57-4009-a46a-c561fa048562&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Foauth%2Fmicrosoft&response_mode=query&scope=api%3A%2F%2F29fa39d4-de57-4009-a46a-c561fa048562%2FUser.Info&state=12345">
              Login with OAuth
            </a>             */}
            <a class="button button-primary block" href="http://localhost:3030/auth">
              Login to Mobex
            </a>            

          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
