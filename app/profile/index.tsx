import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [language, setLanguage] = useState('English');

  const user = {
    name: 'Munir Mohammed',
    email: 'munirmohammed038@gmail.com',
    mosque: 'Anwar Mosque',
    joined: 'March 2026',
  };

  const SettingItem = ({ icon, label, value, onPress, type = 'chevron' }: any) => (
    <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={theme.primary} />
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      </View>
      {type === 'chevron' ? (
        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, { color: theme.tabIconDefault }]}>{value}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.tabIconDefault} />
        </View>
      ) : (
        <Switch 
          value={value} 
          onValueChange={onPress} 
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Profile & Settings', headerShadowVisible: false }} />
      
      <View style={[styles.profileHeader, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
        <SettingItem icon="person-outline" label="Personal Info" value="Edit" />
        <SettingItem icon="business-outline" label="My Mosque" value={user.mosque} />
        <SettingItem icon="calendar-outline" label="Joined" value={user.joined} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>
        <SettingItem 
          icon="notifications-outline" 
          label="Push Notifications" 
          value={notifications} 
          onPress={() => setNotifications(!notifications)} 
          type="switch" 
        />
        <SettingItem 
          icon="moon-outline" 
          label="Dark Mode" 
          value={darkMode} 
          onPress={() => setDarkMode(!darkMode)} 
          type="switch" 
        />
        <SettingItem icon="language-outline" label="Language" value={language} />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
        <SettingItem icon="help-circle-outline" label="Help Center" />
        <SettingItem icon="information-circle-outline" label="About MasjidConnect" />

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 40,
    color: '#065f46',
    fontFamily: 'InterBold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fbbf24',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#065f46',
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'InterBold',
  },
  userEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'InterBold',
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    marginTop: 40,
    marginBottom: 60,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
});
