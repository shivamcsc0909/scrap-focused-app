import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { THEME } from './src/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" backgroundColor={THEME.colors.background} />
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: THEME.colors.background,
  },
});
