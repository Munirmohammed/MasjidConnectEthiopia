import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Colors } from '../../constants/Colors';
import { PrayerTimeService } from '../../services/prayerTimes';
import { useAppStore } from '../../stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { Prayer } from 'adhan';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const ETHIOPIAN_CITIES = [
  { name: 'Addis Ababa', lat: 9.0333, lon: 38.7500 },
  { name: 'Dire Dawa', lat: 9.6008, lon: 41.8591 },
  { name: 'Mekelle', lat: 13.4853, lon: 39.4674 },
  { name: 'Gondar', lat: 12.6000, lon: 37.4667 },
  { name: 'Bahir Dar', lat: 11.5936, lon: 37.3871 },
  { name: 'Jimma', lat: 7.6733, lon: 36.8344 },
  { name: 'Awassa', lat: 7.0522, lon: 38.4714 },
  { name: 'Adama', lat: 8.5414, lon: 39.2689 },
  { name: 'Harar', lat: 9.3117, lon: 42.1288 },
];

export default function PrayerScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];
  const { location, setLocation } = useAppStore();
  
  const [selectedCity, setSelectedCity] = useState(ETHIOPIAN_CITIES[0]);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  
  const lat = location?.latitude || selectedCity.lat;
  const lon = location?.longitude || selectedCity.lon;
  
  const [times, setTimes] = useState<any>(null);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);

  useEffect(() => {
    const pt = PrayerTimeService.getPrayerTimes(lat, lon);
    setTimes(pt);
    
    if (viewMode === 'monthly') {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      const days = eachDayOfInterval({ start, end });
      const monthlyTimes = days.map(day => ({
        day,
        times: PrayerTimeService.getPrayerTimes(lat, lon, day),
      }));
      setCalendarDays(monthlyTimes);
    }
  }, [lat, lon, viewMode]);

  if (!times) return null;

  const prayers = [
    { id: Prayer.Fajr, name: 'Fajr', time: times.fajr },
    { id: Prayer.Sunrise, name: 'Sunrise', time: times.sunrise },
    { id: Prayer.Dhuhr, name: 'Dhuhr', time: times.dhuhr },
    { id: Prayer.Asr, name: 'Asr', time: times.asr },
    { id: Prayer.Maghrib, name: 'Maghrib', time: times.maghrib },
    { id: Prayer.Isha, name: 'Isha', time: times.isha },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity style={styles.citySelector} onPress={() => setCityModalVisible(true)}>
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.cityText}>{location ? 'Current Location' : selectedCity.name}</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.nextPrayerName}>
          {PrayerTimeService.getPrayerName(times.next)}
        </Text>
        <Text style={styles.nextPrayerTime}>
          {PrayerTimeService.formatTime(times[times.next.toLowerCase()] || times.fajr)}
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'daily' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('daily')}
          >
            <Text style={[styles.toggleText, viewMode === 'daily' && styles.toggleTextActive]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'monthly' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('monthly')}
          >
            <Text style={[styles.toggleText, viewMode === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'daily' ? (
        <ScrollView style={styles.listContainer}>
          {prayers.map((p) => {
            const isCurrent = times.current === p.id;
            return (
              <View key={p.id} style={[styles.prayerRow, { backgroundColor: theme.card }, isCurrent && { borderColor: theme.secondary, borderWidth: 2 }]}>
                <Text style={[styles.prayerName, { color: theme.text }]}>{p.name}</Text>
                <Text style={[styles.prayerTime, { color: isCurrent ? theme.secondary : theme.text }]}>
                  {PrayerTimeService.formatTime(p.time)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <FlatList
          data={calendarDays}
          keyExtractor={item => item.day.toISOString()}
          renderItem={({ item }) => (
            <View style={[styles.calendarRow, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <Text style={[styles.calDate, { color: theme.text }]}>{format(item.day, 'dd MMM')}</Text>
              <Text style={[styles.calTime, { color: theme.text }]}>{PrayerTimeService.formatTime(item.times.fajr)}</Text>
              <Text style={[styles.calTime, { color: theme.text }]}>{PrayerTimeService.formatTime(item.times.dhuhr)}</Text>
              <Text style={[styles.calTime, { color: theme.text }]}>{PrayerTimeService.formatTime(item.times.asr)}</Text>
              <Text style={[styles.calTime, { color: theme.text }]}>{PrayerTimeService.formatTime(item.times.maghrib)}</Text>
              <Text style={[styles.calTime, { color: theme.text }]}>{PrayerTimeService.formatTime(item.times.isha)}</Text>
            </View>
          )}
          ListHeaderComponent={
            <View style={[styles.calendarHeader, { backgroundColor: theme.card }]}>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Date</Text>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Fjr</Text>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Dhr</Text>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Asr</Text>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Mgr</Text>
              <Text style={[styles.calHeaderLabel, { color: theme.tabIconDefault }]}>Ish</Text>
            </View>
          }
        />
      )}

      <Modal visible={cityModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select City</Text>
            <FlatList
              data={ETHIOPIAN_CITIES}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.cityItem} 
                  onPress={() => {
                    setSelectedCity(item);
                    setLocation(null);
                    setCityModalVisible(false);
                  }}
                >
                  <Text style={[styles.cityItemText, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCityModalVisible(false)}>
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  citySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  cityText: { color: '#fff', marginHorizontal: 8, fontSize: 14 },
  nextPrayerName: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nextPrayerTime: { color: '#fbbf24', fontSize: 20, fontWeight: 'bold', marginVertical: 4 },
  toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20, marginTop: 20, padding: 4 },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  toggleBtnActive: { backgroundColor: '#fff' },
  toggleText: { color: '#fff', fontSize: 12 },
  toggleTextActive: { color: '#065f46', fontWeight: 'bold' },
  listContainer: { padding: 20 },
  prayerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 12 },
  prayerName: { fontSize: 18 },
  prayerTime: { fontSize: 18, fontWeight: 'bold' },
  calendarHeader: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  calHeaderLabel: { flex: 1, fontSize: 10, textAlign: 'center' },
  calendarRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1 },
  calDate: { flex: 1, fontSize: 12, fontWeight: 'bold' },
  calTime: { flex: 1, fontSize: 10, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  cityItem: { paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  cityItemText: { fontSize: 16 },
  closeBtn: { marginTop: 20, alignItems: 'center', padding: 10 },
});
