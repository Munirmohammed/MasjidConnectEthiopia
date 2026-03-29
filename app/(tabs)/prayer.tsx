import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme, ScrollView, TouchableOpacity, Modal, FlatList, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { PrayerTimeService } from '../../services/prayerTimes';
import { useAppStore } from '../../stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { Prayer as PrayerType } from 'adhan';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ThemedText } from '../../components/ThemedText';
import { Card } from '../../components/Card';
import { LinearGradient } from 'expo-linear-gradient';

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

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerType | null>(null);
  const [athanSettings, setAthanSettings] = useState<Record<string, { muted: boolean; sound: string }>>({});

  useEffect(() => {
    AsyncStorage.getItem('athanSettings').then(val => {
      if (val) setAthanSettings(JSON.parse(val));
    });
  }, []);

  const saveAthanSettings = (newSettings: any) => {
    setAthanSettings(newSettings);
    AsyncStorage.setItem('athanSettings', JSON.stringify(newSettings));
  };

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
    { id: PrayerType.Fajr, name: 'Fajr', icon: 'sunny-outline' },
    { id: PrayerType.Sunrise, name: 'Sunrise', icon: 'sunny' },
    { id: PrayerType.Dhuhr, name: 'Dhuhr', icon: 'sunny-outline' },
    { id: PrayerType.Asr, name: 'Asr', icon: 'partly-sunny-outline' },
    { id: PrayerType.Maghrib, name: 'Moon-outline', icon: 'moon-outline' },
    { id: PrayerType.Isha, name: 'Isha', icon: 'moon' },
  ];

  const getPrayerTime = (id: PrayerType) => {
    switch (id) {
      case PrayerType.Fajr: return times.fajr;
      case PrayerType.Sunrise: return times.sunrise;
      case PrayerType.Dhuhr: return times.dhuhr;
      case PrayerType.Asr: return times.asr;
      case PrayerType.Maghrib: return times.maghrib;
      case PrayerType.Isha: return times.isha;
      default: return new Date();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.primary, '#064e3b']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.citySelector} onPress={() => setCityModalVisible(true)}>
          <Ionicons name="location" size={16} color="#fff" />
          <ThemedText style={styles.cityText}>{location ? 'Current Location' : selectedCity.name}</ThemedText>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.nextPrayerContainer}>
          <ThemedText style={styles.nextPrayerLabel}>Next Prayer</ThemedText>
          <ThemedText type="title" style={styles.nextPrayerName}>
            {PrayerTimeService.getPrayerName(times.next)}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.nextPrayerTime}>
            {PrayerTimeService.formatTime(getPrayerTime(times.next))}
          </ThemedText>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'daily' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('daily')}
          >
            <ThemedText style={[styles.toggleText, viewMode === 'daily' && { color: theme.primary, fontWeight: '700' }]}>Daily</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'monthly' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('monthly')}
          >
            <ThemedText style={[styles.toggleText, viewMode === 'monthly' && { color: theme.primary, fontWeight: '700' }]}>Monthly</ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {viewMode === 'daily' ? (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {prayers.map((p) => {
            const isCurrent = times.current === p.id;
            const prayerTime = getPrayerTime(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => {
                  setSelectedPrayer(p.id);
                  setSettingsModalVisible(true);
                }}
              >
                <Card style={[styles.prayerCard, isCurrent && { borderColor: theme.secondary, borderWidth: 2 }]}>
                  <View style={styles.prayerInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: isCurrent ? theme.secondary : theme.border + '40' }]}>
                      <Ionicons name={p.icon as any} size={24} color={isCurrent ? '#000' : theme.primary} />
                    </View>
                    <View>
                      <ThemedText type="bold" style={styles.prayerNameText}>{p.name}</ThemedText>
                      <ThemedText type="caption">Sunnah: 2 Rakats</ThemedText>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText type="subtitle" style={[styles.prayerTimeText, { color: isCurrent ? theme.primary : theme.text }]}>
                      {PrayerTimeService.formatTime(prayerTime)}
                    </ThemedText>
                    {athanSettings[p.name]?.muted && (
                      <Ionicons name="volume-mute" size={16} color={theme.tabIconDefault} style={{ marginTop: 4 }} />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[styles.calendarHeader, { backgroundColor: theme.card }]}>
            <ThemedText style={styles.calHeaderLabel}>Date</ThemedText>
            <ThemedText style={styles.calHeaderLabel}>Fajr</ThemedText>
            <ThemedText style={styles.calHeaderLabel}>Dhuhr</ThemedText>
            <ThemedText style={styles.calHeaderLabel}>Asr</ThemedText>
            <ThemedText style={styles.calHeaderLabel}>Magh</ThemedText>
            <ThemedText style={styles.calHeaderLabel}>Isha</ThemedText>
          </View>
          <FlatList
            data={calendarDays}
            keyExtractor={item => item.day.toISOString()}
            renderItem={({ item }) => (
              <View style={[styles.calendarRow, { borderBottomColor: theme.border }]}>
                <ThemedText style={styles.calDate}>{format(item.day, 'dd MMM')}</ThemedText>
                <ThemedText style={styles.calTime}>{PrayerTimeService.formatTime(item.times.fajr)}</ThemedText>
                <ThemedText style={styles.calTime}>{PrayerTimeService.formatTime(item.times.dhuhr)}</ThemedText>
                <ThemedText style={styles.calTime}>{PrayerTimeService.formatTime(item.times.asr)}</ThemedText>
                <ThemedText style={styles.calTime}>{PrayerTimeService.formatTime(item.times.maghrib)}</ThemedText>
                <ThemedText style={styles.calTime}>{PrayerTimeService.formatTime(item.times.isha)}</ThemedText>
              </View>
            )}
          />
        </View>
      )}

      <Modal visible={cityModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>Select City</ThemedText>
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
                  <ThemedText style={styles.cityItemText}>{item.name}</ThemedText>
                  {(location === null && selectedCity.name === item.name) && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setCityModalVisible(false)}>
              <ThemedText style={{ color: theme.primary, fontWeight: 'bold' }}>Close</ThemedText>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>
      <Modal visible={settingsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            {selectedPrayer !== null && (() => {
               const pName = prayers.find(p => p.id === selectedPrayer)?.name || '';
               const currentSettings = athanSettings[pName] || { muted: false, sound: 'default' };
               return (
                 <>
                  <ThemedText type="subtitle" style={styles.modalTitle}>{pName} Athan Settings</ThemedText>
                  
                  <View style={styles.settingRow}>
                    <ThemedText style={{fontSize: 16}}>Mute Athan</ThemedText>
                    <Switch
                      value={currentSettings.muted}
                      onValueChange={(val) => {
                        saveAthanSettings({ ...athanSettings, [pName]: { ...currentSettings, muted: val }});
                      }}
                      trackColor={{ false: '#767577', true: theme.primary }}
                    />
                  </View>

                  <View style={styles.settingRow}>
                    <ThemedText style={{fontSize: 16}}>Athan Sound</ThemedText>
                    <TouchableOpacity 
                      style={styles.soundSelector}
                      onPress={() => {
                         const nextSound = currentSettings.sound === 'default' ? 'makkah' : 'default';
                         saveAthanSettings({ ...athanSettings, [pName]: { ...currentSettings, sound: nextSound }});
                      }}
                    >
                      <ThemedText style={{ color: theme.primary, fontWeight: 'bold' }}>
                        {currentSettings.sound === 'makkah' ? 'Makkah' : 'Default'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                 </>
               );
            })()}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSettingsModalVisible(false)}>
              <ThemedText style={{ color: theme.primary, fontWeight: 'bold' }}>Done</ThemedText>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    padding: 30, 
    paddingTop: 60,
    alignItems: 'center', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  citySelector: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 24, 
    marginBottom: 24 
  },
  cityText: { color: '#fff', marginHorizontal: 8, fontSize: 14, fontWeight: '600' },
  nextPrayerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  nextPrayerLabel: {
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  nextPrayerName: { color: '#fff', fontSize: 42, marginBottom: 4 },
  nextPrayerTime: { color: '#fbbf24', fontSize: 24 },
  toggleContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: 24, 
    padding: 4 
  },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  toggleBtnActive: { backgroundColor: '#fff' },
  toggleText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  listContainer: { padding: 20 },
  prayerCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    marginBottom: 12,
    elevation: 1,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  prayerNameText: {
    fontSize: 18,
    marginBottom: 2,
  },
  prayerTimeText: { 
    fontSize: 18, 
    fontWeight: '700' 
  },
  calendarHeader: { 
    flexDirection: 'row', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  calHeaderLabel: { flex: 1, fontSize: 11, fontWeight: '700', textAlign: 'center', color: '#9ca3af' },
  calendarRow: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, alignItems: 'center' },
  calDate: { flex: 1, fontSize: 13, fontWeight: '700' },
  calTime: { flex: 1, fontSize: 11, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    padding: 24, 
    maxHeight: '70%',
    marginBottom: 0,
  },
  modalTitle: { fontSize: 20, marginBottom: 20 },
  cityItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  cityItemText: { fontSize: 16, fontWeight: '500' },
  closeBtn: { marginTop: 24, alignItems: 'center', padding: 12 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  soundSelector: {
    padding: 8,
    backgroundColor: 'rgba(6, 95, 70, 0.1)',
    borderRadius: 8,
  },
});
