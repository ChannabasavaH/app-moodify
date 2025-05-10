import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {UserContext} from '../context/userContext';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import * as Yup from 'yup';

const userProfileSchema = Yup.object().shape({
  mobileNo: Yup.string()
    .length(10, {message: 'Mobile No should be atleast 10 numbers'})
    .required('Mobile No is required'),
  location: Yup.string()
    .min(2, 'Location must be at least 2 characters long')
    .required('Password is required'),
});

const UserProfileScreen = () => {
  const {user}: any = useContext(UserContext);
  const { token } = useContext(AuthContext)
  const [userData, setUserData] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
    profilePhoto: user?.profilePhoto ?? 'https://github.com/shadcn.png',
    mobileNo: user?.mobileNo ?? '',
    location: user?.location ?? '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    userData.profilePhoto,
  );
  const [errors, setErrors] = useState<{mobileNo?: string; location?: string}>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setUserData({
      username: user?.username ?? '',
      email: user?.email ?? '',
      profilePhoto: user?.profilePhoto ?? 'https://github.com/shadcn.png',
      mobileNo: user?.mobileNo ?? '',
      location: user?.location ?? '',
    });
    setPreviewImage(user?.profilePhoto ?? 'https://github.com/shadcn.png');
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

const handleImageChange = () => {
  ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
    if (response.didCancel) return;

    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      if (!selectedImage.uri) return;
      setPreviewImage(selectedImage.uri);
      setUserData(prev => ({
        ...prev,
        profilePhoto: selectedImage.uri,
      }));
      setSelectedFile({
        uri: selectedImage.uri,
        name: selectedImage.fileName ?? 'profile.jpg',
        type: selectedImage.type ?? 'image/jpeg',
      });
    }
  });
};


 const handleSubmit = async () => {
  setIsSubmitting(true);
  setErrors({});

  try {
    await userProfileSchema.validate(
      {
        mobileNo: userData.mobileNo,
        location: userData.location,
      },
      { abortEarly: false },
    );
  } catch (err: any) {
  const formattedErrors: Record<string, string> = {};

  if (err.inner && Array.isArray(err.inner)) {
    err.inner.forEach((error: any) => {
      if (error.path && !formattedErrors[error.path]) {
        formattedErrors[error.path] = error.message;
      }
    });
  } else if (err.path) {
    formattedErrors[err.path] = err.message;
  }

  setErrors(formattedErrors);
  setIsSubmitting(false);
  return;
}

  try {
    const formData = new FormData();
    formData.append('mobileNo', userData.mobileNo);
    formData.append('location', userData.location);

    if (selectedFile) {
      formData.append('profilePhoto', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      });
    }

    await axios.put(
      'http://192.168.214.86:8080/api/users/user-profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      },
    );
    Alert.alert("Profile Updated Successfully");
  } catch (error) {
    console.error('Error updating profile:', error);
    Alert.alert("Error in updating profile");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.center}>
          <View style={styles.imageWrapper}>
            {previewImage ? (
              <Image source={{uri: previewImage}} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <TouchableOpacity
              onPress={handleImageChange}
              style={styles.editIcon}>
              <Text style={styles.iconText}>✎</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="numeric"
            maxLength={10}
            value={userData.mobileNo}
            onChangeText={text => handleChange('mobileNo', text)}
          />
          {errors.mobileNo && (
            <Text style={styles.error}>{errors.mobileNo}</Text>
          )}

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={userData.location}
            onChangeText={text => handleChange('location', text)}
          />
          {errors.location && (
            <Text style={styles.error}>{errors.location}</Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.button, isSubmitting && styles.buttonDisabled]}>
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text style={styles.buttonText}> Updating...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
  },
  center: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  placeholderImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 6,
  },
  iconText: {
    color: 'white',
    fontSize: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: 'black',
  },
  email: {
    color: 'gray',
    marginBottom: 12,
  },
  form: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
    marginBottom: 4,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: 'black',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
