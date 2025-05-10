import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import ImageCapture from './ImageCapture';
import EmotionResults from './EmotionResults';
import PlaylistsRecommendations from './PlaylistsRecommendations';
import axios, { AxiosError } from 'axios';
import { AnalysisResponse } from '../types/index';
import { AuthContext } from '../context/authContext';

const Main: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  
  const { token } = useContext(AuthContext);

  const analyzeEmotion = async (): Promise<void> => {
    if (!image) {
      setError('Please upload or capture the image');
      return;
    }

    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedPlaylist(null);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName ?? 'photo.jpg',
      } as any);

      const response = await axios.post<AnalysisResponse>(
        'http://192.168.214.86:8080/api/analyze-emotion',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      setAnalysisResult(response.data);

      if (response.data.recommendedPlaylists.length > 0) {
        setSelectedPlaylist(response.data.recommendedPlaylists[0].id);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      if (axiosError.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (axiosError.response) {
        const errorMessage =
          axiosError.response.data?.message ??
          `Error: ${axiosError.response.status} - ${axiosError.response.statusText}`;
        setError(errorMessage);
      } else if (axiosError.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError('Failed to analyze image. Please try again.');
      }

      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Mood-Based Music Playlist Generator</Text>
      
      <ImageCapture
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImage={setImage}
      />

      <TouchableOpacity
        style={[
          styles.button, 
          (!image || loading || !token) && styles.disabledButton
        ]}
        onPress={analyzeEmotion}
        disabled={!image || loading || !token}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyze Mood & Get Playlists</Text>
        )}
      </TouchableOpacity>

      {!token && (
        <Text style={styles.warningText}>Please log in to analyze your emotions</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {analysisResult && <EmotionResults analysisResult={analysisResult} />}

      <PlaylistsRecommendations
        loading={loading}
        analysisResult={analysisResult}
        selectedPlaylist={selectedPlaylist}
        setSelectedPlaylist={setSelectedPlaylist}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  warningText: {
    color: '#D97706',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default Main;