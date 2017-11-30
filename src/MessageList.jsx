import React, {Component} from 'react';
import Message from './Message.jsx'
import Notification from './Notification.jsx'

class MessageList extends Component {
  render() {
    const messages = this.props.message.map(message => {
      if (this.props.message.type === "incomingMessage") {
        return <Message key={message.id} username={message.username} content={message.content}/>
      }
      if (this.props.message.type === "incomingNotification") {
        return <Notification message={this.props.messages.content}/>
      }
    })
    return (<main>
      {messages}
    </main>);
  }
}

export default MessageList;
