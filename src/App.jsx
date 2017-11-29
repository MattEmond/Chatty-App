const uniqid = require('uniqid');

import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"},
      messages: [] // messages coming from the server will be stored here as they arrive
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.isEnter = this.isEnter.bind(this)
    this.socket = new WebSocket("ws://localhost:3001");
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

  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("Connected to server");
    };

    this.socket.onmessage = (event) => {
      let parsedEvent = JSON.parse(event.data)
      console.log(parsedEvent);
      this.setState((oldState) => {
        return {messages: [...oldState.messages, parsedEvent]}
      })


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
      <MessageList message={this.state.messages}/>
      <ChatBar user={this.state.currentUser.name} isEnter={this.isEnter}/>
    </div>);
  }
}
export default App;
