import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, RefreshControl, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { communityService, Post, Comment } from '../../services/communityService';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export default function CommunityScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme as keyof typeof Colors];
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Comments state
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await communityService.list();
      setPosts(data.items || []);
    } catch (error) {
      console.warn("Failed to load posts", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (post: Post) => {
    // Optimistic UI update
    const previousLikes = post.likeCount;
    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
         return { ...p, likeCount: p.likeCount + 1 };
      }
      return p;
    }));
    
    try {
      await communityService.like(post.id);
    } catch (error) {
      // Revert if failed
      setPosts(prev => prev.map(p => {
         if (p.id === post.id) return { ...p, likeCount: previousLikes };
         return p;
      }));
    }
  };

  const openComments = async (postId: string) => {
    setSelectedPostId(postId);
    setCommentsModalVisible(true);
    setLoadingComments(true);
    try {
      const data = await communityService.getComments(postId);
      setComments(data || []);
    } catch (e) {
      console.warn("Could not fetch comments");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPostId) return;
    try {
       const commentRes = await communityService.addComment(selectedPostId, newComment);
       setComments(prev => [...prev, commentRes]);
       setNewComment('');
    } catch (e) {
       Alert.alert("Error", "Could not post comment");
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{item.user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: theme.text }]}>{item.user?.name || 'Anonymous'}</Text>
          <Text style={[styles.postDate, { color: theme.tabIconDefault }]}>
            {format(new Date(item.createdAt || Date.now()), 'MMM d, h:mm a')}
          </Text>
        </View>
      </View>
      <Text style={[styles.postContent, { color: theme.text }]}>{item.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerAction} onPress={() => handleLike(item)}>
          <Ionicons name="heart" size={20} color={theme.tabIconDefault} />
          <Text style={[styles.footerActionText, { color: theme.tabIconDefault }]}>
            {item.likeCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction} onPress={() => openComments(item.id)}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.tabIconDefault} />
          <Text style={[styles.footerActionText, { color: theme.tabIconDefault }]}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <View style={[styles.header, { backgroundColor: theme.card }]}>
         <Text style={[styles.headerTitle, { color: theme.text }]}>Community Noticeboard</Text>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: theme.tabIconDefault }}>No posts found. Be the first to post!</Text>
          </View>
        }
      />

      <Modal visible={commentsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentsModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {loadingComments ? (
              <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={comments}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={[styles.commentCard, { borderBottomColor: theme.border }]}>
                     <Text style={[styles.authorName, { color: theme.text, fontSize: 13 }]}>{item.user?.name || 'Anonymous'}</Text>
                     <Text style={{ color: theme.text, marginTop: 4 }}>{item.content}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={{ color: theme.tabIconDefault, textAlign: 'center', marginTop: 20 }}>No comments yet.</Text>}
              />
            )}

            <View style={[styles.commentInputRow, { borderTopColor: theme.border }]}>
               <TextInput
                 style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                 placeholder="Write a comment..."
                 placeholderTextColor={theme.tabIconDefault}
                 value={newComment}
                 onChangeText={setNewComment}
               />
               <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.primary }]} onPress={handleAddComment}>
                 <Ionicons name="send" size={16} color="#fff" />
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  headerTitle: { fontSize: 18, fontFamily: 'InterBold' },
  list: { padding: 16 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontFamily: 'InterBold' },
  authorInfo: { marginLeft: 12 },
  authorName: { fontSize: 16, fontFamily: 'InterBold' },
  postDate: { fontSize: 12, fontFamily: 'Inter' },
  postContent: { fontSize: 15, fontFamily: 'Inter', lineHeight: 22, marginBottom: 16 },
  postFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
  footerAction: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  footerActionText: { fontSize: 14, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  commentCard: { paddingVertical: 12, borderBottomWidth: 1 },
  commentInputRow: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, height: 40, marginRight: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
