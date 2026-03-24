import React from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { format } from 'date-fns';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Prayer Reminder',
    message: 'Time for Asr prayer in Addis Ababa.',
    time: new Date().toISOString(),
    type: 'prayer',
  },
  {
    id: '2',
    title: 'Community Update',
    message: 'New announcement: Anwar Mosque renovation progress.',
    time: new Date(Date.now() - 3600000).toISOString(),
    type: 'community',
  },
  {
    id: '3',
    title: 'Donation Received',
    message: 'Thank you for your generous donation to Nur Mosque.',
    time: new Date(Date.now() - 86400000).toISOString(),
    type: 'donation',
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(6, 95, 70, 0.1)' }]}>
        <Ionicons 
          name={item.type === 'prayer' ? 'time' : item.type === 'community' ? 'megaphone' : 'heart'} 
          size={24} 
          color={theme.primary} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.message, { color: theme.tabIconDefault }]}>{item.message}</Text>
        <Text style={[styles.time, { color: theme.tabIconDefault }]}>
          {format(new Date(item.time), 'MMM d, h:mm a')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 12, alignItems: 'center' },
  iconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1, marginLeft: 16 },
  title: { fontSize: 16, fontFamily: 'InterBold' },
  message: { fontSize: 14, fontFamily: 'Inter', marginTop: 2 },
  time: { fontSize: 12, marginTop: 6 },
});
