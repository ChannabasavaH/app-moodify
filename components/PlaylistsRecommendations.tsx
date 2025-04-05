import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { AnalysisResponse } from '../types/index';
import SelectedPlaylist from './SelectedPlaylists';

interface PlaylistsRecommendationsProps {
  loading: boolean;
  analysisResult: AnalysisResponse | null;
  selectedPlaylist: string | null;
  setSelectedPlaylist: (id: string | null) => void;
}

const PlaylistsRecommendations: React.FC<PlaylistsRecommendationsProps> = ({
  loading,
  analysisResult,
  selectedPlaylist,
  setSelectedPlaylist,
}) => {
  const renderPlaylistButtons = () => (
    <View style={styles.playlistButtonsContainer}>
      {analysisResult?.recommendedPlaylists.map((playlist) => (
        <TouchableOpacity
          key={playlist.id}
          style={[
            styles.playlistButton,
            selectedPlaylist === playlist.id && styles.selectedPlaylistButton,
          ]}
          onPress={() => setSelectedPlaylist(playlist.id)}
        >
          <Text
            style={[
              styles.playlistButtonText,
              selectedPlaylist === playlist.id && styles.selectedPlaylistButtonText,
            ]}
          >
            {playlist.name.length > 30 ? `${playlist.name.substring(0, 30)}...` : playlist.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Music Recommendations</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : analysisResult?.recommendedPlaylists?.length ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderPlaylistButtons()}

          {selectedPlaylist && (
            <SelectedPlaylist
              playlist={analysisResult.recommendedPlaylists.find((p) => p.id === selectedPlaylist)!}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No music recommendations yet</Text>
          <Text style={styles.subText}>
            Upload or capture a photo to get personalized playlists based on your mood
          </Text>
        </View>
      )}
    </View>
  );
};

export default PlaylistsRecommendations;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  playlistButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  playlistButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPlaylistButton: {
    backgroundColor: '#4f46e5',
  },
  playlistButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedPlaylistButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  subText: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
