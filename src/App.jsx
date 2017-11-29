const uniqid = require('uniqid');

import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        name: "Bob"
      }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id: 1,
          username: "Bob",
          content: "Has anyone seen my marbles?"
        }, {
          id: 2,
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
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
    const messages = this.state.messages.concat(newMessage);
    this.setState({messages: messages});
  }


  componentDidMount() {
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
      <ChatBar user={this.state.currentUser.name} isEnter={this.isEnter.bind(this)}/>
    </div>);
  }
}
export default App;
