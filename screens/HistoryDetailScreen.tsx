import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import WebView from 'react-native-webview';

const HistoryDetailScreen = () => {
  const route = useRoute();
  const {id} = route.params;
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `http://192.168.111.86:8080/api/history/${id}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setPlaylist(res.data.playlist);
      } catch (error: any) {
        console.error(
          'Error signing up:',
          error.response?.data ?? error.message,
        );
        Alert.alert('Error', 'Failed to fetch playlist details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Playlist not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: playlist.imageUrl}} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.label}>Playlist</Text>
          <Text style={styles.title}>{playlist.name}</Text>
          <Text style={styles.description}>{playlist.description}</Text>
          <Text style={styles.tracks}>{playlist.tracks} tracks</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(playlist.externalUrl)}
            style={styles.linkButton}>
            <Text style={styles.linkText}>Open on Spotify</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spotify Embed URL could be handled via WebView if needed */}
      <WebView source={{ uri: playlist.embedUrl }} style={{ height: 400 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 16,
  },
  details: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 12,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  tracks: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  linkButton: {
    marginVertical: 12,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  linkText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default HistoryDetailScreen;
