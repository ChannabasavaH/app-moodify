import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {PlaylistInfo} from '../types/index';
import axios from 'axios';
import Icon from '@react-native-vector-icons/fontawesome';
import { AuthContext } from '../context/authContext';

interface PlaylistCardProps {
  playlist: PlaylistInfo & {_id: string};
  moodTag: string;
}

const SelectedPlaylist: React.FC<PlaylistCardProps> = ({playlist, moodTag}) => {
  const screenWidth = Dimensions.get('window').width;
  const embedHeight = (screenWidth * 9) / 16;

  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://192.168.163.86:8080/api/favorites', {
          headers: {
           'Authorization': `Bearer ${token}`
          }
        });
        const favoritePlaylists = res.data.favoritePlaylists;

        // Map the favorite status for each playlist
        const updatedFavoriteStatus: {[key: string]: boolean} = {};

        favoritePlaylists.forEach((fav: any) => {
          updatedFavoriteStatus[fav.playlist] = true;
        });

        setFavoriteStatus(updatedFavoriteStatus);
      } catch (err) {
        if (err instanceof Error) {
          console.log('Error updating favorites:', err.message);
        } else {
          console.log('Unknown error updating favorites:', JSON.stringify(err));
        }
      }
    };

    fetchFavorites();
  }, []);

  const addToFavorites = async () => {
    try {
      const data = {
        playlistId: playlist._id,
        moodTag: moodTag,
      };

      await axios.post(
        'http://192.168.163.86:8080/api/favorites',
        data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      Alert.alert('Successful in adding to favorites');
    } catch (err) {
      if (err instanceof Error) {
        console.log('Error updating favorites:', err.message);
      } else {
        console.log('Unknown error updating favorites:', JSON.stringify(err));
      }
    }
  };

  const removeFromFavorites = async () => {
    try {
       await axios.delete(
        'http://192.168.163.86:8080/api/favorites',
        {
          data: {
            playlistId: playlist._id,
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        },
      );
      Alert.alert('Success in deleting from favorites');
    } catch (err) {
      if (err instanceof Error) {
        console.log('Error updating favorites:', err.message);
      } else {
        console.log('Unknown error updating favorites:', JSON.stringify(err));
      }
    }
  };

  const toggleFavorite = useCallback(async () => {
    try {
      const updatedFavoriteStatus = {...favoriteStatus}; // Copy current state

      if (!favoriteStatus[playlist._id]) {
        // If the playlist is not in favorites, add it
        await addToFavorites();
        updatedFavoriteStatus[playlist._id] = true;
      } else {
        // If the playlist is already in favorites, remove it
        await removeFromFavorites();
        updatedFavoriteStatus[playlist._id] = false;
      }

      // Update the favorite status for that specific playlist
      setFavoriteStatus(updatedFavoriteStatus);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error updating favorites:', error.message);
      } else {
        console.log('Error updating favorites:', JSON.stringify(error));
      }
    }
  }, [favoriteStatus, playlist._id]);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Playlist Image and Meta Info */}
        <View style={styles.imageSection}>
          <Image
            source={{uri: playlist.imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />

          <TouchableOpacity onPress={toggleFavorite} style={styles.heart}>
            {favoriteStatus[playlist._id] ? (
              <Icon name="heart" color="red" size={30} />
            ) : (
              <Icon name="heart" color="white" size={30} />
            )}
          </TouchableOpacity>

          <Text style={styles.tracksText}>{playlist.tracks} tracks</Text>

          <TouchableOpacity
            onPress={() => Linking.openURL(playlist.externalUrl)}>
            <Text style={styles.linkText}>Open in Spotify</Text>
          </TouchableOpacity>
        </View>

        {/* Playlist Info and Embedded Player */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{playlist.name}</Text>
          {playlist.description ? (
            <Text style={styles.description}>{playlist.description}</Text>
          ) : null}

          <View style={{height: embedHeight, marginTop: 16}}>
            <WebView
              source={{uri: playlist.embedUrl}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={['*']}
              startInLoadingState
              style={styles.webview}
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
    position: 'relative',
  },
  image: {
    width: '90%',
    height: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 25,
    zIndex: 10,
    padding: 10,
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
