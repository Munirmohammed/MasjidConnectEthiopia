import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { POSTS, CAMPAIGNS, Post, Campaign } from '../../constants/Community';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState<'notices' | 'donations'>('notices');

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{item.author.charAt(0)}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: theme.text }]}>{item.author}</Text>
          <Text style={[styles.postDate, { color: theme.tabIconDefault }]}>
            {format(new Date(item.date), 'MMM d, h:mm a')} • {item.category}
          </Text>
        </View>
      </View>
      <Text style={[styles.postContent, { color: theme.text }]}>{item.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="heart-outline" size={20} color={theme.tabIconDefault} />
          <Text style={[styles.footerActionText, { color: theme.tabIconDefault }]}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.tabIconDefault} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="share-social-outline" size={20} color={theme.tabIconDefault} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCampaign = ({ item }: { item: Campaign }) => {
    const progress = Math.min(item.raised / item.goal, 1);
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.campaignTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.mosqueName, { color: theme.primary }]}>{item.mosqueName}</Text>
        <Text style={[styles.description, { color: theme.tabIconDefault }]}>{item.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.primary }]} />
          </View>
          <View style={styles.progressStats}>
            <Text style={[styles.statsText, { color: theme.text }]}>
              {item.raised.toLocaleString()} ETB raised
            </Text>
            <Text style={[styles.statsText, { color: theme.tabIconDefault }]}>
              Goal: {item.goal.toLocaleString()} ETB
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.donateButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.donateButtonText}>Donate Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'notices' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('notices')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'notices' ? theme.primary : theme.tabIconDefault }]}>Noticeboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'donations' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('donations')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'donations' ? theme.primary : theme.tabIconDefault }]}>Donations</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'notices' ? POSTS : CAMPAIGNS as any}
        renderItem={activeTab === 'notices' ? renderPost : renderCampaign}
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
  tabContainer: {
    flexDirection: 'row',
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'InterBold',
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'InterBold',
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontFamily: 'InterBold',
  },
  postDate: {
    fontSize: 12,
    fontFamily: 'Inter',
  },
  postContent: {
    fontSize: 15,
    fontFamily: 'Inter',
    lineHeight: 22,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerActionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  campaignTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
  },
  mosqueName: {
    fontSize: 14,
    fontFamily: 'InterBold',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter',
    marginVertical: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
    fontFamily: 'InterBold',
  },
  donateButton: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
});
