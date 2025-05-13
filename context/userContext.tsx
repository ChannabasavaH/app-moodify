import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import axios from 'axios';
import {AuthContext} from './authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceEventEmitter} from 'react-native';

type User = {
  username: string;
  email: string;
  profilePhoto: string;
  mobileNo: string;
  location: string;
};

type Playlist = {
  _id: string;
  name: string;
  imageUrl: string;
};

type Favorite = {
  moodTag: string;
  playlist: Playlist;
};

type History = {
  dominant: string;
  recommendedPlaylists: Playlist;
};

type UserContextType = {
  user: User | null;
  favorites: Favorite[];
  history: History[];
  loading: boolean;
  fetchUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const fetchUser = async () => {
    try {
      // Check if token exists and is valid before making request
      const currentToken = await AsyncStorage.getItem('accessToken');
      
      if (!currentToken) {
        console.log('No token available');
        setLoading(false);
        return;
      }

      // Format the token properly for the Authorization header
      const authToken = currentToken.trim();
      
      const res = await axios.get('http://192.168.111.86:8080/api/dashboard', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const userData = res.data.user.user;
      if (userData) {
        setUser({
          username: userData.username ?? '',
          email: userData.email ?? '',
          profilePhoto:
            userData.profilePhoto ?? 'https://github.com/shadcn.png',
          mobileNo: userData.mobileNo ?? '',
          location: userData.location ?? '',
        });

        setFavorites(res.data?.favoritePlaylists ?? []);
        setHistory(res.data?.moodHistory?.moodHistory ?? []);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('API Error:', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.log('Error fetching user data:', err.message);
      } else {
        console.log('Unknown error fetching user data:', JSON.stringify(err));
      }
      setUser(null);
      setFavorites([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch user data when token is available and valid
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        // Validate token exists in AsyncStorage before making request
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (!storedToken) {
          console.log('No token in AsyncStorage');
          setLoading(false);
          return;
        }
        
        fetchUser();
      } catch (error) {
        console.log('Error in loadUserData:', error);
        setLoading(false);
      }
    };

    // Use a timeout to ensure any token refreshes complete
    const timeout = setTimeout(() => {
      loadUserData();
    }, 500);

    return () => clearTimeout(timeout);
  }, [token]);

  // Listen for token updates from setAccessToken
  useEffect(() => {
    const handleTokenUpdate = async () => {
      try {
        const newToken = await AsyncStorage.getItem('accessToken');
        
        if (newToken) {
          // Set loading to true when we're fetching new data
          setLoading(true);
          // Give a little time for the token to be properly saved
          setTimeout(() => fetchUser(), 300);
        } else {
          // Clear user data if token is removed
          setUser(null);
          setFavorites([]);
          setHistory([]);
          setLoading(false);
        }
      } catch (error) {
        console.log('Error handling token update:', error);
        setLoading(false);
      }
    };

    // Listen for the custom event from setAccessToken
    const subscription = DeviceEventEmitter.addListener(
      'accessTokenUpdated',
      handleTokenUpdate,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      favorites,
      history,
      loading,
      fetchUser,
    }),
    [user, favorites, history, loading],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};