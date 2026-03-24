import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { KHUTBAHS, Khutbah } from '../../constants/Khutbahs';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { format } from 'date-fns';

export default function KhutbahScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function playSound(khutbah: Khutbah) {
    if (playingId === khutbah.id) {
      await sound?.pauseAsync();
      setPlayingId(null);
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    setLoadingId(khutbah.id);
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: khutbah.audioUrl },
      { shouldPlay: true }
    );
    setSound(newSound);
    setPlayingId(khutbah.id);
    setLoadingId(null);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlayingId(null);
      }
    });
  }

  const renderKhutbah = ({ item }: { item: Khutbah }) => {
    const isPlaying = playingId === item.id;
    const isLoading = loadingId === item.id;

    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.imam, { color: theme.tabIconDefault }]}>{item.imamName} • {item.mosqueName}</Text>
            <View style={styles.meta}>
              <Text style={[styles.metaText, { color: theme.tabIconDefault }]}>
                {format(new Date(item.date), 'MMM d, yyyy')} • {item.duration}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: theme.primary }]}
            onPress={() => playSound(item)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={KHUTBAHS}
        renderItem={renderKhutbah}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerSubtitle, { color: theme.tabIconDefault }]}>
              Recent Friday Sermons from Ethiopia
            </Text>
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
  header: {
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  imam: {
    fontSize: 14,
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
