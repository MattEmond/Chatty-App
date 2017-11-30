import React, {Component} from 'react';


class ChatBar extends Component {
  render() {
    return (<footer className="chatbar">
      <input className="chatbar-username" placeholder="Enter a Name Here" value={this.props.user.name} onChange={this.props.handleChange} onKeyPress={this.props.isUsernameEnter}/>
      <input className="chatbar-message" placeholder={"Type a message and hit ENTER"} onKeyPress={this.props.isEnter} />
    </footer>);
  }
}
export default ChatBar;
