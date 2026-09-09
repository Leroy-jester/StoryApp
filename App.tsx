import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [cameraAberta, setCameraAberta] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  // =========================
  // ABRIR CÂMERA
  // =========================

  async function abrirCamera() {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à câmera para tirar uma foto.'
        );

        return;
      }
    }

    setCameraAberta(true);
  }

  // =========================
  // TIRAR FOTO
  // =========================

  async function tirarFoto() {
    if (!cameraRef.current) {
      return;
    }

    try {
      const resultado = await cameraRef.current.takePictureAsync();

      if (resultado?.uri) {
        setFoto(resultado.uri);
        setCameraAberta(false);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível tirar a foto.'
      );
    }
  }

  // =========================
  // ABRIR GALERIA
  // =========================

  async function abrirGaleria() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'É necessário permitir o acesso às fotos para escolher uma imagem.'
      );

      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  }

  // =========================
  // SALVAR NA GALERIA
  // =========================

  async function salvarFoto() {
    if (!foto) {
      Alert.alert(
        'Nenhuma foto',
        'Tire uma foto ou selecione uma imagem da galeria primeiro.'
      );

      return;
    }

    if (!mediaPermission?.granted) {
      const permission = await requestMediaPermission();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à galeria para salvar a foto.'
        );

        return;
      }
    }

    try {
      await MediaLibrary.saveToLibraryAsync(foto);

      Alert.alert(
        'Foto salva!',
        'A foto foi salva na galeria do dispositivo.'
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar a foto.'
      );
    }
  }

  // =========================
  // TELA DA CÂMERA
  // =========================

  if (cameraAberta) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        />

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setCameraAberta(false)}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={tirarFoto}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =========================
  // TELA PRINCIPAL
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>

        {/* CABEÇALHO */}

        <View style={styles.header}>
          <Text style={styles.logo}>✨ My Story</Text>

          <Text style={styles.subtitle}>
            Crie seu momento
          </Text>
        </View>

        {/* ÁREA DA FOTO */}

        <View style={styles.storyContainer}>

          {foto ? (
            <Image
              source={{ uri: foto }}
              style={styles.preview}
            />
          ) : (
            <View style={styles.emptyPreview}>

              <Text style={styles.cameraIcon}>
                📸
              </Text>

              <Text style={styles.emptyTitle}>
                Sua história começa aqui
              </Text>

              <Text style={styles.emptyText}>
                Tire uma foto ou escolha uma imagem da sua galeria
              </Text>

            </View>
          )}

        </View>

        {/* BOTÕES */}

        <View style={styles.buttonsContainer}>

          {/* BOTÃO 1 */}

          <TouchableOpacity
            style={styles.button}
            onPress={abrirCamera}
          >
            <Text style={styles.buttonIcon}>
              📷
            </Text>

            <View>
              <Text style={styles.buttonTitle}>
                Tirar foto
              </Text>

              <Text style={styles.buttonDescription}>
                Usar a câmera
              </Text>
            </View>
          </TouchableOpacity>

          {/* BOTÃO 2 */}

          <TouchableOpacity
            style={styles.button}
            onPress={abrirGaleria}
          >
            <Text style={styles.buttonIcon}>
              🖼️
            </Text>

            <View>
              <Text style={styles.buttonTitle}>
                Galeria
              </Text>

              <Text style={styles.buttonDescription}>
                Escolher uma foto
              </Text>
            </View>
          </TouchableOpacity>

          {/* BOTÃO 3 */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              !foto && styles.disabledButton,
            ]}
            onPress={salvarFoto}
            disabled={!foto}
          >
            <Text style={styles.saveButtonText}>
              💾 Salvar foto
            </Text>
          </TouchableOpacity>

        </View>

        {/* RODAPÉ */}

        <Text style={styles.footer}>
          Compartilhe seus melhores momentos
        </Text>

      </View>
    </SafeAreaView>
  );
}

// =========================
// ESTILOS
// =========================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#111111',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },

  // HEADER

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  subtitle: {
    color: '#999999',
    fontSize: 14,
    marginTop: 5,
  },

  // FOTO

  storyContainer: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#333333',
  },

  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  emptyPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  cameraIcon: {
    fontSize: 55,
    marginBottom: 20,
  },

  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  emptyText: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // BOTÕES

  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },

  button: {
    minHeight: 65,
    backgroundColor: '#202020',
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },

  buttonIcon: {
    fontSize: 26,
    marginRight: 15,
  },

  buttonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonDescription: {
    color: '#888888',
    fontSize: 12,
    marginTop: 3,
  },

  saveButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButton: {
    opacity: 0.35,
  },

  // FOOTER

  footer: {
    color: '#666666',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },

  // CÂMERA

  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },

  camera: {
    flex: 1,
  },

  cameraControls: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#111111',
  },

  cancelButton: {
    position: 'absolute',
    left: 25,
    bottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },

  cancelText: {
    color: '#ffffff',
    fontSize: 14,
  },

});