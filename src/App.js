import React, { useState, useEffect } from 'react';
// import Login from './Login';
import Enter from './Enter';
import Chat from './Chat';
import client from './feathers';

// Study  https://reactjs.org/docs/hooks-effect.html  
// App component:
// - display Login or Chat component
// - subscribe to authenticated event
// - get messages and users
// - pass messages and users to Chat component.

// Login component 
// - display 'Login' or 'Login as email'
// - display 'signout of account'
// - redirect /auth
// - call Microsoft login 
// - redirect /auth-callback
// - redirect /?email=user-email
// - login to user account.
// Chat component
// - display Chat component
// - display signout button
// - has users and messages state
// - subscribe to create message and user events
// - concatenates new users and messages to array
// - reverses message array and trims to 25 messages
// - unsubscribes to create user and message events

const messagesService = client.service('messages');
const usersService = client.service('users');

const Application = () => {

  // https://reactjs.org/docs/hooks-effect.html  
  // use 2nd param so authenticate only happens when component
  // mounts and does no clean up.
  const [login, setLogin] = useState(null);
  const [email, setEmail] = useState(null);
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
  

  const [given_name, setGivenName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  // subscribe to logout event in this effect
  // needs clean up to prevent memory leaks
  // use 2nd param so listener only gets added when component mounts
  useEffect(() => {
    function myLogout() {
      setLogin(null);
      setMessages([]);
      setUsers([]);
    }
  
    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', myLogout);

    return () => {
      // Clean up listeners
      client.removeListener('logout', myLogout);
    };
  },[]);   

  // subscribe to message events in this effect
  // needs clean up to prevent memory leaks
  // use 2nd param so listener only gets added when component mounts
  useEffect(() => {
    function AddMessage(message) {
      setMessages(currentMessages => currentMessages.concat(message));    
    }

    messagesService.on('created', AddMessage);

    return () => {
      // Clean up listeners
      messagesService.removeListener('created', AddMessage);
    };
  },[]);    

  // https://stackoverflow.com/questions/68213212/why-is-this-api-call-being-called-twice-in-react

  usersService.on('created', user => {
    setUsers(currentUsers => currentUsers.concat(user))
  });
  // subscribe to user events in this effect
  // needs clean up to prevent memory leaks
  // use 2nd param so listener only gets added when component mounts
  useEffect(() => {
    function AddUser(user) {
      setUsers(currentUsers => currentUsers.concat(user));
    }

    usersService.on('created', AddUser);
    return () => {
      // Clean up listeners
      usersService.removeListener('created', AddUser);
    };
  },[]);    

  // https://docs.feathersjs.com/api/authentication/service.html#app-on-login
  // app.on('login')
  // https://fusebit.io/blog/oauth-state-parameters-nodejs/?utm_source=www.google.com&utm_medium=referral&utm_campaign=none
  // subscribe to authenticated events in this effect
  // needs clean up to prevent memory leaks
  // use 2nd param so listener only gets added when component mounts
  useEffect(() => {
    function Authenticate(loginResult) {
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
      });
    }
    // On successfull login
    client.on('authenticated', Authenticate);
    return () => {
      // Clean up listeners
      client.removeListener('authenticated', Authenticate);
    };
  },[]);    


    // Add new users to the user list

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
