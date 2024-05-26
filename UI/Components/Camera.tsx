import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraScreen = () => {
  const camera = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.front; // Front camera for selfies

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      setHasPermission(
        cameraPermission === 'authorized' &&
        microphonePermission === 'authorized'
      );
    };

    getPermissions();
  }, []);

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          quality: 85,
          skipMetadata: true,
        });
        console.log(photo.uri); // You can use the image URI here
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  if (device == null || !hasPermission) {
    return <Text>Waiting for camera...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.preview}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <Text style={styles.captureText}> SNAP </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureText: {
    fontSize: 14,
  },
});

export default CameraScreen;
