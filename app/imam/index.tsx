import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import { IMAMS, Imam } from '../../constants/Imams';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

export default function ImamDirectoryScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredImams = IMAMS.filter(imam => 
    imam.name.toLowerCase().includes(search.toLowerCase()) ||
    imam.specialty.toLowerCase().includes(search.toLowerCase()) ||
    imam.mosqueName.toLowerCase().includes(search.toLowerCase())
  );

  const renderImam = ({ item }: { item: Imam }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/imam/${item.id}`)}
    >
      <View style={styles.imamInfo}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.textDetails}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.mosque, { color: theme.tabIconDefault }]}>{item.mosqueName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.specialty}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.tabIconDefault} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Imam Directory', headerBackTitle: 'Back' }} />
      
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.tabIconDefault} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, mosque, or specialty..."
          placeholderTextColor={theme.tabIconDefault}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredImams}
        renderItem={renderImam}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'InterBold',
  },
  textDetails: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'InterBold',
  },
  mosque: {
    fontSize: 14,
    fontFamily: 'Inter',
    marginVertical: 2,
  },
  badge: {
    backgroundColor: 'rgba(6, 95, 70, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeText: {
    color: '#065f46',
    fontSize: 12,
    fontFamily: 'InterBold',
  },
});
