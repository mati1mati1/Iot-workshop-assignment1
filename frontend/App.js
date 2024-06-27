import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import * as signalR from '@microsoft/signalr';

export default function App() {
  const [counter, setCounter] = useState(null); // Initial state is null to indicate loading
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function connectSignalR() {
      try {
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl("https://signelrfuncs.azurewebsites.net/api", {
            withCredentials: true,
          })
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        hubConnection.on('newMessage', (message) => {
          setCounter(parseInt(message));
        });

        await hubConnection.start();
        setConnection(hubConnection);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    }

    async function fetchInitialCounter() {
      try {
        const response = await fetch("https://counterfun.azurewebsites.net/api/GetCounter?", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCounter(parseInt(data));  // Update the counter state immediately with the fetched value
        setLoading(false); // Set loading to false after fetching the data
      } catch (error) {
        console.error("Error fetching initial counter:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    }

    fetchInitialCounter();
    connectSignalR();
  }, []);

  const increaseCounter = () => {
    fetch("https://counterfun.azurewebsites.net/api/IncreaseCounter?", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.text())
      .then((text) => setCounter(parseInt(text)))
      .catch((error) => console.error(error));
  };

  const decreaseCounter = () => {
    fetch("https://counterfun.azurewebsites.net/api/DecreaseCounter?", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.text())
      .catch((error) => console.error(error));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
