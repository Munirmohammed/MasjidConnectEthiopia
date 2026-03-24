import React from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function KhutbahScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Friday Khutbahs</Text>
      <Text style={[styles.subtitle, { color: theme.tabIconDefault }]}>
        Listen to recent recordings from across Ethiopia...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'InterBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});
