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

const FavoritesScreen = () => {
  const {favorites} = useUser();
  const [selectedMood, setSelectedMood] = useState('all');
  const navigation = useNavigation();

  // Filter favorites based on selected mood
  const filteredFavorites =
    selectedMood === 'all'
      ? favorites
      : favorites.filter(fav => fav.moodTag === selectedMood);

  // Render each category button
  const renderCategoryButton = useCallback(
    ({item}) => (
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
    ),
    [selectedMood],
  );

  // Render each playlist card
  const renderPlaylistCard = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('FavoriteDetailScreen', {id: item.playlist._id})
        }>
        <Image
          source={{uri: item.playlist.imageUrl}}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.playlist.name}</Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.title}>🎵 Favorite Playlists</Text>

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
        {filteredFavorites.length > 0 ? (
          <FlatList
            data={filteredFavorites}
            renderItem={renderPlaylistCard}
            keyExtractor={item => item.playlist._id}
            numColumns={2}
            columnWrapperStyle={styles.playlistGrid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorite playlists found.</Text>
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
  scroll: {
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: 'black',
  },
});

export default FavoritesScreen;
