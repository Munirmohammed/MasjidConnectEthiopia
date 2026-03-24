import React from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MOSQUES } from '../../constants/Mosques';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function MosqueDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const mosque = MOSQUES.find(m => m.id === id);

  if (!mosque) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Mosque not found</Text>
      </View>
    );
  }

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${mosque.latitude},${mosque.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: mosque.name, headerBackTitle: 'Map' }} />
      
      <View style={[styles.hero, { backgroundColor: theme.primary }]}>
        <Ionicons name="location" size={48} color="#fff" />
        <Text style={styles.heroTitle}>{mosque.name}</Text>
        <Text style={styles.heroSubtitle}>{mosque.city}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contacts</Text>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={20} color={theme.primary} />
            <Text style={[styles.rowText, { color: theme.text }]}>Imam: {mosque.imam}</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`tel:${mosque.phone}`)}>
            <Ionicons name="call-outline" size={20} color={theme.primary} />
            <Text style={[styles.rowText, { color: theme.text }]}>{mosque.phone}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
          <View style={styles.chipContainer}>
            {mosque.features.map(f => (
              <View key={f} style={[styles.chip, { backgroundColor: 'rgba(6, 95, 70, 0.1)' }]}>
                <Text style={styles.chipText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.directionsButton, { backgroundColor: theme.primary }]} onPress={openMaps}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'InterBold',
    textAlign: 'center',
    marginTop: 12,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: 'Inter',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowText: {
    fontSize: 16,
    fontFamily: 'Inter',
    marginLeft: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#065f46',
    fontSize: 14,
    fontFamily: 'InterBold',
  },
  directionsButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'InterBold',
    marginLeft: 10,
  },
});
