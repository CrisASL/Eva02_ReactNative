import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface NewTaskProps {
  onCreate: (task: {
    title: string;
    imageUri: string | null;
    location: { latitude: number; longitude: number } | null;
  }) => void;
}

export default function NewTask({ onCreate }: NewTaskProps) {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const saveTask = async (task: any) => {
    try {
      const stored = await AsyncStorage.getItem("tasks");
      const tasks = stored ? JSON.parse(stored) : [];

      tasks.push(task);

      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tarea guardada en AsyncStorage");
    } catch (err) {
      console.log("Error guardando tarea:", err);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Se requiere permiso para usar la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Debes ingresar un título");
      return;
    }

    const task = { title, imageUri, location };

    // 🔥 Guardar en AsyncStorage
    await saveTask(task);

    // Mantener compatibilidad con tu componente padre
    onCreate(task);

    // Reset
    setTitle("");
    setImageUri(null);
    setLocation(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nueva tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Título de la tarea"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tomar Foto</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Obtener ubicación</Text>
      </TouchableOpacity>

      {location && (
        <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
        </Text>
      )}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleCreate}>
        <Text style={styles.buttonTextPrimary}>Crear tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 180,
    marginVertical: 10,
    borderRadius: 8,
  },
  locationText: {
    marginTop: 5,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonTextPrimary: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
