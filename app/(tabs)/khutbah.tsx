import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { khutbahService, Khutbah } from '../../services/khutbahService';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

export default function KhutbahScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];
  
  const [khutbahs, setKhutbahs] = useState<Khutbah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchKhutbahs = async () => {
    try {
      const data = await khutbahService.list();
      setKhutbahs(data.items || []);
    } catch (error) {
      console.warn("Failed to fetch khutbahs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKhutbahs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKhutbahs();
  };

  const handleShare = async (item: Khutbah) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Notice", "Sharing is not available on this device");
        return;
      }
      await Sharing.shareAsync(item.audioUrl, { dialogTitle: "Share Khutbah" });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDownload = async (item: Khutbah) => {
    try {
      Alert.alert("Downloading...", "Saving audio file offline");
      // @ts-ignore
      const dir = FileSystem.documentDirectory || '';
      const uri = dir + item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3';
      const result = await FileSystem.downloadAsync(item.audioUrl, uri);
      if (result.status === 200) {
        Alert.alert("Success", "Khutbah downloaded successfully to your device!");
      }
    } catch (e) {
      console.warn("Download failed:", e);
      Alert.alert("Error", "Failed to download Khutbah.");
    }
  };

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
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: khutbah.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingId(khutbah.id);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      Alert.alert("Playback Error", "Failed to load the audio file.");
    } finally {
      setLoadingId(null);
    }
  }

  const renderKhutbah = ({ item }: { item: Khutbah }) => {
    const isPlaying = playingId === item.id;
    const isLoading = loadingId === item.id;

    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.imam, { color: theme.tabIconDefault }]}>{item.imam?.name || 'Unknown Imam'} • {item.mosque?.name || 'Unknown Mosque'}</Text>
            <View style={styles.meta}>
              <Text style={[styles.metaText, { color: theme.tabIconDefault }]}>
                {format(new Date(item.createdAt || Date.now()), 'MMM d, yyyy')} • {item.duration || 0} mins
              </Text>
            </View>
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionItem} onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <Ionicons name="document-text-outline" size={16} color={theme.primary} />
                <Text style={[styles.actionText, { color: theme.primary }]}>Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleDownload(item)}>
                <Ionicons name="download-outline" size={16} color={theme.primary} />
                <Text style={[styles.actionText, { color: theme.primary }]}>Offline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleShare(item)}>
                <Ionicons name="share-social-outline" size={16} color={theme.primary} />
                <Text style={[styles.actionText, { color: theme.primary }]}>Share</Text>
              </TouchableOpacity>
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

        {expandedId === item.id && (
          <View style={[styles.notesContainer, { backgroundColor: 'rgba(6, 95, 70, 0.05)' }]}>
            <Text style={[styles.notesTitle, { color: theme.text }]}>Sermon Notes</Text>
            <Text style={[styles.notesText, { color: theme.text }]}>
              This sermon focuses on the importance of brotherhood and community in Islam, specifically highlighting recent local events in Addis Ababa...
            </Text>
          </View>
        )}
      </View>
    );
  };

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
        data={khutbahs}
        renderItem={renderKhutbah}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerSubtitle, { color: theme.tabIconDefault }]}>
              Recent Friday Sermons from Ethiopia
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: theme.tabIconDefault }}>No khutbahs found.</Text>
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
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'InterBold',
    marginLeft: 4,
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  notesTitle: {
    fontSize: 14,
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    fontFamily: 'Inter',
    lineHeight: 18,
  },
});
