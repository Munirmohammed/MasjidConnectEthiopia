import React from 'react';
import { Text, TextStyle, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  type?: 'title' | 'subtitle' | 'body' | 'caption' | 'bold';
  numberOfLines?: number;
}

export function ThemedText({ children, style, type = 'body', numberOfLines }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const getStyle = () => {
    switch (type) {
      case 'title': return styles.title;
      case 'subtitle': return styles.subtitle;
      case 'caption': return styles.caption;
      case 'bold': return styles.bold;
      default: return styles.body;
    }
  };

  return (
    <Text 
      style={[getStyle(), { color: theme.text }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  bold: {
    fontSize: 16,
    fontWeight: '700',
  },
});
