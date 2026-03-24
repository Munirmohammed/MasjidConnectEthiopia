import React from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../../constants/Colors';
import { IMAMS } from '../../constants/Imams';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ImamDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const imam = IMAMS.find(i => i.id === id);

  if (!imam) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Imam not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Imam Profile', headerBackTitle: 'Directory' }} />
      
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>{imam.name.charAt(0)}</Text>
        </View>
        <Text style={styles.nameLarge}>{imam.name}</Text>
        <Text style={styles.specialtyLarge}>{imam.specialty}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={24} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.tabIconDefault }]}>Mosque Affiliation</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{imam.mosqueName}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${imam.phone}`)}>
            <Ionicons name="call" size={24} color={theme.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.tabIconDefault }]}>Contact Phone</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{imam.phone}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Biography</Text>
        <Text style={[styles.bio, { color: theme.text }]}>{imam.bio}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <Ionicons name="chatbubble-ellipses" size={24} color={theme.primary} />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.card }]}>
            <Ionicons name="videocam" size={24} color={theme.primary} />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarTextLarge: {
    color: '#065f46',
    fontSize: 48,
    fontFamily: 'InterBold',
  },
  nameLarge: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'InterBold',
  },
  specialtyLarge: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: 'Inter',
    marginTop: 4,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    marginBottom: 2,
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
  bio: {
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 24,
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionButton: {
    flex: 0.48,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'InterBold',
    marginTop: 8,
  },
});
