import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";



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

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
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

  const handleCreate = () => {
    if (!title.trim()) {
      alert("Debes ingresar un título");
      return;
    }

    onCreate({
      title,
      imageUri,
      location,
    });

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

      <Button title="Seleccionar Imagen" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Button title="Obtener ubicación" onPress={getLocation} />
      {location && (
        <Text style={styles.locationText}>
          Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
        </Text>
      )}

      <Button title="Crear tarea" onPress={handleCreate} />
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
});
