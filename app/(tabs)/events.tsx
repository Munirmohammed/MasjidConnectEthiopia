import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { eventService, Event as IslamicEvent } from '../../services/eventService';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await eventService.list();
      setEvents(data.items || []); // Assuming PaginatedEvents has an "items" array
    } catch (error) {
      console.warn("Failed to fetch events", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderEvent = ({ item }: { item: IslamicEvent }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={[styles.categoryBadge, { backgroundColor: 'rgba(6, 95, 70, 0.1)' }]}>
        <Text style={styles.categoryText}>Event</Text>
      </View>
      
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.tabIconDefault }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.primary} />
          <Text style={[styles.footerText, { color: theme.text }]}>
            {format(new Date(item.date), 'MMM d')} {item.time}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={16} color={theme.primary} />
          <Text style={[styles.footerText, { color: theme.text }]} numberOfLines={1}>
            {item.mosque?.name || item.location || 'Unknown location'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.tabIconDefault }}>No upcoming events found.</Text>
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
  list: {
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    color: '#065f46',
    fontSize: 12,
    fontFamily: 'InterBold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'InterBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter',
    marginLeft: 6,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
});
