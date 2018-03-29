import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Scrubber from './Scrubber';

function makeColor() {
  return (
    'rgb(0, ' +
    ((155 + Math.random() * 100) | 0) +
    ',' +
    ((155 + Math.random() * 100) | 0) +
    ')'
  );
}

const messages = [];
for (let i = 0; i < 500; i++) {
  messages.push({
    id: i,
    color: makeColor()
  });
}

class App extends React.Component {
  state = { messages, currentMessageIndex: 499 };

  componentDidMount() {
    setTimeout(() => {
      const { messages } = this.state;

      this.setState({
        messages: [...messages, { id: 500, color: makeColor() }]
      });
    }, 2000);
  }

  addMessage() {}

  render() {
    const { messages, currentMessageIndex } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: 'blue',
          flexDirection: 'row'
        }}
      >
        <Scrubber messages={messages} currentMessageIndex={500} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
