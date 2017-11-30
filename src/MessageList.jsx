import React, {Component} from 'react';
import Message from './Message.jsx'
import Notification from './Notification.jsx'

class MessageList extends Component {
  render() {
    const messages = this.props.message.map(message => {
      if (message.type === "incomingMessage") {
        return <Message key={message.id} username={message.username} content={message.content} colour={message.colour}/>
      }
      if (message.type === "incomingNotification") {
        return <Notification key={message.key} message={message.content}/>
      }
    })
    return (<main>
      {messages}
    </main>);
  }
}

export default MessageList;
