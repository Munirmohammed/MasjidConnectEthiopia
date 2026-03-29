import React, { useState } from 'react';
import { StyleSheet, View, useColorScheme, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { IMAMS, Imam } from '../../constants/Imams';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { Card } from '../../components/Card';

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
      activeOpacity={0.7}
      onPress={() => router.push(`/imam/${item.id}`)}
    >
      <Card style={styles.card}>
        <View style={styles.imamInfo}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '15' }]}>
            <ThemedText style={[styles.avatarText, { color: theme.primary }]}>{item.name.charAt(0)}</ThemedText>
          </View>
          <View style={styles.textDetails}>
            <ThemedText type="bold" style={styles.name}>{item.name}</ThemedText>
            <ThemedText type="caption" style={styles.mosque}>{item.mosqueName}</ThemedText>
            <View style={[styles.badge, { backgroundColor: theme.primary + '10' }]}>
              <ThemedText type="caption" style={[styles.badgeText, { color: theme.primary }]}>{item.specialty}</ThemedText>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.tabIconDefault} />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ 
        title: 'Scholarly Directory', 
        headerLargeTitle: true,
        headerTintColor: theme.primary,
        headerStyle: { backgroundColor: theme.background },
      }} />
      
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.tabIconDefault} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, mosque, or specialty..."
          placeholderTextColor={theme.tabIconDefault}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.tabIconDefault} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredImams}
        renderItem={renderImam}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={theme.border} />
            <ThemedText style={{ color: theme.tabIconDefault, marginTop: 16 }}>No imams found matching your search.</ThemedText>
          </View>
        }
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
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderWidth: 0,
  },
  imamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  textDetails: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 17,
  },
  mosque: {
    marginVertical: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
