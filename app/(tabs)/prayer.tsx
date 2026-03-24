import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { PrayerTimeService } from '../../services/prayerTimes';
import { useAppStore } from '../../stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { Prayer } from 'adhan';

export default function PrayerScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { location } = useAppStore();
  
  // Default to Addis Ababa if location is not available
  const lat = location?.latitude || 9.0333;
  const lon = location?.longitude || 38.7500;
  
  const [times, setTimes] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const pt = PrayerTimeService.getPrayerTimes(lat, lon);
    setTimes(pt);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10s for countdown/current indicator
    
    return () => clearInterval(timer);
  }, [lat, lon]);

  if (!times) return null;

  const prayers = [
    { id: Prayer.Fajr, name: 'Fajr', time: times.fajr },
    { id: Prayer.Sunrise, name: 'Sunrise', time: times.sunrise },
    { id: Prayer.Dhuhr, name: 'Dhuhr', time: times.dhuhr },
    { id: Prayer.Asr, name: 'Asr', time: times.asr },
    { id: Prayer.Maghrib, name: 'Maghrib', time: times.maghrib },
    { id: Prayer.Isha, name: 'Isha', time: times.isha },
  ];

  const currentPrayer = times.current;
  const nextPrayer = times.next;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Next Prayer</Text>
        <Text style={styles.nextPrayerName}>
          {PrayerTimeService.getPrayerName(nextPrayer)}
        </Text>
        <Text style={styles.nextPrayerTime}>
          {PrayerTimeService.formatTime(times[nextPrayer.toLowerCase()] || times.fajr)}
        </Text>
      </View>

      <View style={styles.listContainer}>
        {prayers.map((p) => {
          const isCurrent = currentPrayer === p.id;
          return (
            <View 
              key={p.id} 
              style={[
                styles.prayerRow, 
                { backgroundColor: theme.card },
                isCurrent && { borderColor: theme.secondary, borderWidth: 2 }
              ]}
            >
              <View style={styles.prayerInfo}>
                <Ionicons 
                  name={isCurrent ? "volume-high" : "notifications-outline"} 
                  size={20} 
                  color={isCurrent ? theme.secondary : theme.tabIconDefault} 
                />
                <Text style={[styles.prayerName, { color: theme.text }]}>{p.name}</Text>
              </View>
              <Text style={[styles.prayerTime, { color: isCurrent ? theme.secondary : theme.text }]}>
                {PrayerTimeService.formatTime(p.time)}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={[styles.qiblaButton, { backgroundColor: theme.card }]}>
        <Ionicons name="compass" size={24} color={theme.primary} />
        <Text style={[styles.qiblaText, { color: theme.text }]}>Qibla Compass</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.tabIconDefault} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    opacity: 0.8,
  },
  nextPrayerName: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'InterBold',
    marginVertical: 4,
  },
  nextPrayerTime: {
    color: '#fbbf24', // Gold
    fontSize: 20,
    fontFamily: 'InterBold',
  },
  listContainer: {
    padding: 20,
    marginTop: -20,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 18,
    fontFamily: 'Inter',
    marginLeft: 12,
  },
  prayerTime: {
    fontSize: 18,
    fontFamily: 'InterBold',
  },
  qiblaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
  },
  qiblaText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InterBold',
    marginLeft: 12,
  },
});
