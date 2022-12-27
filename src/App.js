import React, { useState, useEffect } from 'react';
import Login from './Login';
import Enter from './Enter';
import Chat from './Chat';
import client from './feathers';

const messagesService = client.service('messages');
const usersService = client.service('users');

const Application = () => {
  const [login, setLogin] = useState(null);
  const [email, setEmail] = useState(null);
  const [given_name, setGivenName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // On logout reset all all local state (which will then show the login screen)
  client.on('logout', () => {
    setLogin(null);
    setMessages([]);
    setUsers([]);
  });


  // https://stackoverflow.com/questions/68213212/why-is-this-api-call-being-called-twice-in-react
  messagesService.on('created', message => {
    setMessages(currentMessages => currentMessages.concat(message))
  });

  usersService.on('created', user => {
    setUsers(currentUsers => currentUsers.concat(user))
  });

  // https://docs.feathersjs.com/api/authentication/service.html#app-on-login
  // app.on('login')
  // https://fusebit.io/blog/oauth-state-parameters-nodejs/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none
  // On successfull login
  client.on('authenticated', loginResult => {
    setGivenName(loginResult.user.given_name);
    // Get all users and messages
    Promise.all([
      messagesService.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      }),
      usersService.find(),
    ]).then(([messagePage, userPage]) => {
      // We want the latest messages but in the reversed order
      const messagesResult = messagePage.data.reverse();
      const usersResult = userPage.data;

      // Once both return, update the state
      setLogin(loginResult);
      setMessages(messagesResult);
      setUsers(usersResult);
    })
  });


    // Add new users to the user list
    // https://reactjs.org/docs/hooks-effect.html  
  useEffect(() => {

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => {
      setLogin(null);
      const params = new URLSearchParams(window.location.search)
      const email_param = params.get('email')
      setEmail(email_param);
    
    });
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
  // } );
  }, []);
  if (login === undefined) {
    return (
      <main className="container text-center">
        <h1>Loading...</h1>
      </main>
    );
  } else if ((login === null) && (email !== undefined) && (email !== null)) {
    return <Enter email={email} given_name={given_name} />;
  } else if (login) {
    return <Chat messages={messages} users={users} />;
  }  else {
    return <Enter email={null} />;
  }

};

export default Application;
