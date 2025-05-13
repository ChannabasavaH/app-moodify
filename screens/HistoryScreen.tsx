import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../context/userContext';
import Navbar from '../components/Navbar';

const {width} = Dimensions.get('window');

// Define mood categories
const moodCategories = [
  {label: 'All', value: 'all', emoji: '🌈'},
  {label: 'Joy', value: 'joy', emoji: '😊'},
  {label: 'Sorrow', value: 'sorrow', emoji: '😢'},
  {label: 'Angry', value: 'angry', emoji: '😡'},
  {label: 'Surprise', value: 'surprise', emoji: '😲'},
  {label: 'Chill', value: 'chill', emoji: '😌'},
];

const HistoryScreen = () => {
  const {history} = useUser();
  const [selectedMood, setSelectedMood] = useState('all');
  const navigation = useNavigation();

  // Transform history data to a more usable format
  const flattenedPlaylists = history.reduce((acc, historyItem) => {
    // Make sure recommendedPlaylists exists and is an array
    if (historyItem.recommendedPlaylists && Array.isArray(historyItem.recommendedPlaylists)) {
      // Map over each playlist and add the dominant mood and timestamp
      const playlists = historyItem.recommendedPlaylists.map(playlist => ({
        playlist: playlist,
        dominant: historyItem.dominant,
        timestamp: historyItem.timestamp,
        confidenceScore: historyItem.confidenceScore,
        historyId: historyItem._id
      }));
      return [...acc, ...playlists];
    }
    return acc;
  }, []);

  // Filter based on selected mood
  const filteredHistory =
    selectedMood === 'all'
      ? flattenedPlaylists
      : flattenedPlaylists.filter(
          item => item.dominant === selectedMood,
        );

  // Render each category button
  const renderCategoryButton = useCallback(({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedMood === item.value && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedMood(item.value)}>
      <Text
        style={[
          styles.categoryButtonText,
          selectedMood === item.value && styles.selectedCategoryButtonText,
        ]}>
        {item.emoji} {item.label}
      </Text>
    </TouchableOpacity>
  ), [selectedMood]);

  // Render each playlist card
  const renderPlaylistCard = useCallback(({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('HistoryDetailScreen', {
          id: item.playlist._id,
          historyId: item.historyId
        })
      }>
      <Image
        source={{uri: item.playlist.imageUrl}}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.playlist.name}
        </Text>
        <Text style={styles.cardMood}>
          {moodCategories.find(mood => mood.value === item.dominant)?.emoji} {item.dominant}
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.title}>🎵 History Playlists</Text>

        {/* Mood Category Buttons */}
        <FlatList
          horizontal
          data={moodCategories}
          renderItem={renderCategoryButton}
          keyExtractor={item => item.value}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
        />

        {/* Playlist Cards */}
        {filteredHistory.length > 0 ? (
          <FlatList
            data={filteredHistory}
            renderItem={renderPlaylistCard}
            keyExtractor={(item, index) => `${item.playlist._id}-${index}`}
            numColumns={2}
            columnWrapperStyle={styles.playlistGrid}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.playlistContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No playlists found for this mood.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: 'black',
  },
  categoryList: {
    maxHeight: 50,
    marginBottom: 20,
  },
  categoryListContent: {
    paddingRight: 16,
  },
  categoryButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#2563eb',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  playlistContainer: {
    paddingVertical: 20,
  },
  playlistGrid: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: (width - 40) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginBottom: 4,
  },
  cardMood: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default HistoryScreen;