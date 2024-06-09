import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [counter, setCounter] = useState(0);

  
  
  const increaseCounter = () => {
    fetch("https://increasecounter.azurewebsites.net/api/IncreaseCounter?", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
    }).then((response) => {
      return response.text();
    }).then((text) => {
      setCounter(parseInt(text));
    }).catch(
      (error) => { console.error(error); }
    );

  };

  const decreaseCounter = () => {
    fetch("https://increasecounter.azurewebsites.net/api/DecreaseCounter?", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
    },
    }).then((response) => {
      return response.text();
    }).then((text) => {
      setCounter(parseInt(text));
    }).catch(
      (error) => { console.error(error); }
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Counter: {counter}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Increase" onPress={increaseCounter} />
        <Button title="Decrease" onPress={decreaseCounter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  counterText: {
    fontSize: 32,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
