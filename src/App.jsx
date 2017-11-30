const uniqid = require('uniqid');

import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: ""},
      messages: [] // messages coming from the server will be stored here as they arrive
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.isEnter = this.isEnter.bind(this);
    this.socket = new WebSocket("ws://localhost:3001");
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  handleChange(event) {
    console.log(`Event is : ${event.target.value}`)
      let currentUser = {name: event.target.value}
      this.setState({currentUser: currentUser});

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }


  isEnter(event) {
    let message = event.target.value
    let user = this.state.currentUser.name
    if (event.key === "Enter") {
      this.sendMessage(message, user)
    }
  }

  sendMessage(message, user) {
    const newMessage = {
      id: uniqid(),
      username: user,
      content: message
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  postNotification(newUser, oldUser) {
    const userChange = {
      id: uniqid(),
      newUser:newUser,
      oldUser:oldUser,
      type:"incomingNotification",
    }
    this.socket.send(JSON.stringify(userChange))
}

  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("Connected to server");
    };

    this.socket.onmessage = (event) => {
      // Socket event data is encoded as a JSON string
      // Line below turns it into an obj
      let data = JSON.parse(event.data)
      switch(data.type) {
        case "incomingMessage" :
          this.setState((oldState) => {
            return {messages: [...oldState.messages, data]}
        })
          break;
        case "incomingNotification" :
        console.log('Made it to incomingNotification')
        console.log(messages)
        let content = data.oldUser + " changed name to " + data.newUser;
        let notification = {type: data.type, content: content, key: data.id};
        let messages = this.state.messages.concat(notification);
        this.setState({messages: messages})
        //this.setState((oldState) => {
          //return {messages: [...oldState.messages, data]}
        //})
          break;
        default:
        // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type)
      }
    }


    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {
        id: 3,
        username: "Michelle",
        content: "Hello there!"
      };
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  render() {
    return (<div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
      </nav>
      <MessageList message={this.state.messages} incomingNotification={this.incomingNotification}/>
      <ChatBar user={this.state.currentUser} isEnter={this.isEnter} handleChange={this.handleChange}/>
    </div>);
  }
}
export default App;
