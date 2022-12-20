import React, { useState } from 'react';
import client from './feathers';

const Enter = ({ email }) => {
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


  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Enter Mobex</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => enter()}
            >
              Enter Brent
            </button>

          </form>
        </div>
      </div>
    </main>
  );
};

export default Enter;
