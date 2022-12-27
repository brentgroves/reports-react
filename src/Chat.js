import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import client from './feathers';
import jwt_decode from "jwt-decode";

const Chat = ({ users, messages }) => {
  const chatRef = useRef(null);

  function sendMessage(ev) {
    const input = ev.target.querySelector('[name="text"]');
    const text = input.value.trim();

    if (text) {
      client
        .service('messages')
        .create({ text })
        .then(() => {
          input.value = '';
        });
    }

    ev.preventDefault();
  }

  function scrollToBottom() {
    let chat = chatRef.current;
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  }


  useEffect(() => {
    // client.service('messages').on('created', scrollToBottom);
    // scrollToBottom();

    // return () => {
    //   // Clean up listeners
    //   client.service('messages').removeListener('created', scrollToBottom);
    // };
  });

  return (
    <main className="flex flex-column">
      <header className="title-bar flex flex-row flex-center">
        <div className="title-wrapper block center-element">
          <img crossOrigin='anonymous' className="logo" src="http://feathersjs.com/img/feathers-logo-wide.png" alt="Feathers Logo" />
          <span className="title">Chat</span>
        </div>
      </header>

      <div className="flex flex-row flex-1 clear">
        <aside className="sidebar col col-3 flex flex-column flex-space-between">
          <header className="flex flex-row flex-center">
            <h4 className="font-300 text-center">
              <span className="font-600 online-count">{users.length}</span>{' '}
              users
            </h4>
          </header>

          <ul className="flex flex-column flex-1 list-unstyled user-list">
            {users.map(user => (
              <li key={user._id}>
                <a className="block relative" href="#">
                  <img crossOrigin='anonymous' src={user.avatar} alt={user.email} className="avatar" />
                  <span className="absolute username">{user.email}</span>
                </a>
              </li>
            ))}
          </ul>
          <footer className="flex flex-row flex-center">
          {/* https://docs.feathersjs.com/api/authentication/client.html#configuration */}
          {/* https://ui.vision/howto/view-local-storage */}
          {/* https://docs.feathersjs.com/api/authentication/client.html#storage */}
          {/* https://community.auth0.com/t/login-as-different-user-after-logout/68121 */}
          {/* https://auth0.com/docs/authenticate/login/logout */}
          {/* https://auth0.com/docs/api/authentication#logout */}
            <a
              href="#"
              onClick={() => {
                const promise = new Promise(async (resolve, reject) => {
                  // const { accessToken } = await client.get('authentication');
                  // resolve(jwt_decode(accessToken))
                  const { user } = await client.get('authentication');
                  resolve(user)
                  // resolve('We did it!')
                })                
                promise.then((response) => {
                  console.log(response)
                })
              }}
              className="button button-primary"
            >
              Get User
            </a>
            <a
              href="#"
              onClick={() => {
                const promise = new Promise(async (resolve, reject) => {
                  const { accessToken } = await client.get('authentication');
                  resolve(jwt_decode(accessToken))
                })                
                promise.then((response) => {
                  console.log(response)
                })
              }}
              className="button button-primary"
            >
              Get Token
            </a>
            {/* href="https://dev-gfcd1ld5m2jtz0m0.us.auth0.com/v2/logout?federated&client_id=IGs15ncDb9uKQujCzzSYUm8qFgnqaTE5&returnTo=http://localhost:3000" */}

            <a
              href="#"
              // href="http://localhost:3030/signout"
              onClick={() => {
                client.logout();
                // return true;
              }}
              className="button button-primary"
            >
              Sign Out
            </a>
          </footer>
        </aside>

        <div className="flex flex-column col col-9">
          <main className="chat flex flex-column flex-1 clear" ref={chatRef}>
            {messages.map(message => (
              <div key={message._id} className="message flex flex-row">
                <img crossOrigin='anonymous' src={message.user.avatar} alt={message.user.email} className="avatar" />
                <div className="message-wrapper">
                  <p className="message-header">
                    <span className="username font-600">
                      {message.user.email}
                    </span>
                    <span className="sent-date font-300">
                      {moment(message.createdAt).format('MMM Do, hh:mm:ss')}
                    </span>
                  </p>
                  <p className="message-content font-300">{message.text}</p>
                </div>
              </div>
            ))}
          </main>

          <form
            onSubmit={sendMessage.bind(this)}
            className="flex flex-row flex-space-between"
            id="send-message"
          >
            <input type="text" name="text" className="flex flex-1" />
            <button className="button-primary" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chat;
