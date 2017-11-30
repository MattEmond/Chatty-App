const uniqid = require('uniqid');

import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempUser: {
        name: ""
      },
      currentUser: {
        name: "Anon"
      },
      messages: [],
      colour: "black"
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.isEnter = this.isEnter.bind(this);
    this.isUsernameEnter = this.isUsernameEnter.bind(this);
    this.socket = new WebSocket("ws://localhost:3001");
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let tempUser = {name: event.target.value}
    this.setState({tempUser: tempUser});
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

  isUsernameEnter(event) {
    if (event.key === "Enter") {
      const oldUser = this.state.currentUser;
      const newUser = this.state.tempUser;
      this.postNotification(newUser, oldUser);
      this.setState({ currentUser: this.state.tempUser })
    }
  }

  sendMessage(message, user) {
    const newMessage = {
      id: uniqid(),
      username: user,
      content: message,
      type: "incomingMessage",
      colour: this.state.colour
    };
    this.socket.send(JSON.stringify(newMessage));
  }

  postNotification(newUser, oldUser) {
    const userChange = {
      id: uniqid(),
      newUser:newUser,
      oldUser:oldUser,
      type: "incomingNotification"
    }
    this.socket.send(JSON.stringify(userChange))
}

  componentDidMount() {
    this.socket.onopen = (event) => {
      console.log("Connected to server");
    };
    this.socket.onmessage = (event) => {
      let data = JSON.parse(event.data)
      switch(data.type) {
        case "incomingMessage" :
          this.setState((oldState) => {
            return {messages: [...oldState.messages, data]}
          })
          break;
        case "incomingNotification" :
          let content = data.oldUser.name + " changed name to " + data.newUser.name;
          let notification = {type: data.type, content: content, key: data.id};
          let messages = this.state.messages.concat(notification);
          this.setState({messages: messages})
          break;
        case "userCount" :
          this.setState({usersOnline: data.userNumber})
          break;
        case "colour":
          this.setState({ colour: data.colour })
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type)
        }
      }
    }

  render() {
    return (<div>
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <h2 className="counter" >{ this.state.usersOnline } Users Online </h2>
      </nav>
      <MessageList message={this.state.messages}/>
      <ChatBar user={this.state.tempUser} isEnter={this.isEnter} isUsernameEnter={this.isUsernameEnter} handleChange={this.handleChange}/>
    </div>);
  }
}
export default App;
