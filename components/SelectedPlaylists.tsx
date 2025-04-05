import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { PlaylistInfo } from '../types/index';

interface SelectedPlaylistProps {
  playlist: PlaylistInfo;
}

const SelectedPlaylist: React.FC<SelectedPlaylistProps> = ({ playlist }) => {
  const screenWidth = Dimensions.get('window').width;
  const embedHeight = (screenWidth * 9) / 16; // 16:9 aspect ratio

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Playlist Image and Meta Info */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: playlist.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.tracksText}>{playlist.tracks} tracks</Text>

          <TouchableOpacity onPress={() => Linking.openURL(playlist.externalUrl)}>
            <Text style={styles.linkText}>Open in Spotify</Text>
          </TouchableOpacity>
        </View>

        {/* Playlist Info and Embedded Player */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{playlist.name}</Text>
          {playlist.description ? (
            <Text style={styles.description}>{playlist.description}</Text>
          ) : null}

          <View style={{ height: embedHeight, marginTop: 16 }}>
            <WebView
              source={{ uri: playlist.embedUrl }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SelectedPlaylist;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  contentWrapper: {
    flexDirection: 'column',
    gap: 16,
  },
  imageSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: '90%',
    height: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tracksText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  linkText: {
    marginTop: 8,
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  webview: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
