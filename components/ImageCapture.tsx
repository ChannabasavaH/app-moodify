import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

interface ImageCaptureProps {
  setImage: (image: any) => void;
  setImagePreview?: (uri: string | null) => void;
  imagePreview?: string | null;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ setImage, setImagePreview: externalSetImagePreview, imagePreview: externalImagePreview }) => {
  const [internalImagePreview, setInternalImagePreview] = useState<string | null>(null);
  
  const imagePreview = externalImagePreview !== undefined ? externalImagePreview : internalImagePreview;
  const setImagePreview = externalSetImagePreview || setInternalImagePreview;

  const handleImageSelection = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image selection');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', response.errorMessage ?? 'Something went wrong with the image picker');
    } else if (response.assets && response.assets.length > 0) {
      const selectedAsset = response.assets[0];
      if (selectedAsset.uri) {
        setImagePreview(selectedAsset.uri);
        setImage(selectedAsset);
      }
    }
  };

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8 as any,
      includeBase64: false,
    };
    
    launchImageLibrary(options)
      .then(handleImageSelection)
      .catch(error => {
        console.error('Image library error:', error);
        Alert.alert('Error', 'Failed to open image library');
      });
  };

  const captureImage = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8 as any,
      includeBase64: false,
      saveToPhotos: true,
    };
    
    launchCamera(options)
      .then(handleImageSelection)
      .catch(error => {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to open camera. Make sure you have granted camera permissions.');
      });
  };

  return (
    <View style={styles.container}>
      {imagePreview ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.uploadButton]} 
          onPress={selectImage}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cameraButton]} 
          onPress={captureImage}
        >
          <Text style={styles.buttonText}>Use Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  placeholderContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: '#4f46e5',
    marginRight: 8,
  },
  cameraButton: {
    backgroundColor: '#4b5563',
    marginLeft: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ImageCapture;