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

  
  useEffect(() => {
    // https://stackoverflow.com/questions/68213212/why-is-this-api-call-being-called-twice-in-react
    messagesService.on('created', message => {

      setMessages(currentMessages => currentMessages.concat(message))
    });
  
    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => {
      setLogin(null);
      const params = new URLSearchParams(window.location.search)
      const email_param = params.get('email')
      setEmail(email_param);
      // if (email_param === null) {
      //   setEmail(null);
      // }else{
      //   setEmail(auth);
      // }

      // if (session_id === '') {
      // } else {
      //   client
      //   .authenticate({
      //     strategy: 'local',
      //     email:'brentgroves@1hkt5t.onmicrosoft.com',
      //     password:'passwordless'
      //   })
      //   .catch(err => console.log('auth error'));      
      // }
    
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
      });
    });

    // On logout reset all all local state (which will then show the login screen)
    // client.on('login', (authResult) => {
    //   console.log('in login')
    // });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => {
      setLogin(null);
      setMessages([]);
      setUsers([]);
    });
// https://meticulous.ai/blog/getting-started-with-react-logging/
    // Add new messages to the message list
    // messagesService.on('created', message =>
    //   console.log("message =" + JSON.stringify(message))
    // );
    // function checkMessages(message) {
    //   return message._id == id;
    // }    
    // messagesService.on('created', message => {
    //   setMessages(currentMessages => currentMessages.concat(message))

      // Promise.all([
      //   messagesService.find({
      //     query: {
      //       $sort: { createdAt: -1 },
      //       $limit: 25,
      //     },
      //   })
      // ]).then(([messagePage]) => {
      //   // We want the latest messages but in the reversed order
      //   const messagesResult = messagePage.data.reverse();
      //   setMessages(messagesResult);
      // });
      // const exists = messages;
      // if(messages.length>0)
      // {
      //   const exists = messages.find(function (element) {
      //     return element._id === message._id;
      //   });
      //   if (exists === undefined) 
      //   {
      //     setMessages(message => messages.concat(message))
      //   }      
      // }
      // else 
      // {
      //   setMessages(message => messages.concat(message))
      // }  
      // setMessages(currentMessages => currentMessages.concat(message))
      // console.log(JSON.stringify(message))    
    // });

    // Add new users to the user list
    usersService.on('created', user => {
      setUsers(currentUsers => currentUsers.concat(user))

      // const exists = users.find(user);
      // if (exists === undefined) 
      // {
      //   setUsers(users => users.concat(user))
      // }      

      // }
  });
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
  // } );
  }, []);

  // https://flaviocopes.com/urlsearchparams/
  // const params = new URLSearchParams(window.location.search)
  // const email = params.get('email')
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
 
  // return <Enter />;
};

export default Application;
