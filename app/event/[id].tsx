import React from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { EVENTS } from '../../constants/Events';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const event = EVENTS.find(e => e.id === id);

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Event Details', headerBackTitle: 'Events' }} />
      
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        <Text style={styles.title}>{event.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={24} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.tabIconDefault }]}>Date & Time</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {format(new Date(event.date), 'EEEE, MMMM do, yyyy')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {format(new Date(event.date), 'h:mm a')}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.tabIconDefault }]}>Location</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{event.location}</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{event.mosqueName}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>About this Event</Text>
        <Text style={[styles.description, { color: theme.text }]}>{event.description}</Text>

        <TouchableOpacity style={[styles.rsvpButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.rsvpButtonText}>RSVP / Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterBold',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'InterBold',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    marginTop: -40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'InterBold',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 24,
    marginBottom: 30,
  },
  rsvpButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'InterBold',
  },
});
