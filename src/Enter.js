import React, { useState } from 'react';
import client from './feathers';

const Enter = ({ email, given_name }) => {
  // const [email, setEmail] = useState();
  // const [password, setPassword] = useState();
  const [error, setError] = useState();

  function enter() {
    return client
      .authenticate({
        strategy: 'local',
        email:email,
        password:'passwordless',
      })
      .catch(err => setError(err));
  }
  var login_button;
  if (email===null) {
    login_button =            
      <a class="button button-primary block" href="http://localhost:3030/auth">
        Sign In
      </a>;
  } else if (given_name===null) {
    login_button =            
      <button
      type="button"
      className="button button-primary block signup"
      onClick={() => enter()}
      >
      Login 
      </button>;
  } else if (given_name!==null) {
    login_button =            
      <button
      type="button"
      className="button button-primary block signup"
      onClick={() => enter()}
      >
      Login as {given_name}
      </button>;
  }
  var signout_button;
  if(email===null)
  {
    signout_button="";
  }
  else 
  {
    signout_button =
    <a
    href="http://localhost:3030/signout"
    className="button button-primary"
    >
      Sign out of your account 
    </a>;
  }

  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Welcome to Mobex</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            {login_button}
            login_button =            
      <a class="button button-primary block" href="http://localhost:3030/oauth/microsoft">
        Log In for Microsoft
      </a>;

            {signout_button}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Enter;
