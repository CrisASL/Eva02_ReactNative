import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Task } from "../utils/types";
interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {task.completed ? "✅ " : "⬜ "}
        {task.title}
      </Text>

      {task.imageUri && (
        <Image source={{ uri: task.imageUri }} style={styles.image} />
      )}

      {task.location && (
        <Text style={styles.location}>
          Ubicación: {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
        </Text>
      )}

      <View style={styles.buttons}>
        <Button
          title={task.completed ? "Desmarcar" : "Completar"}
          onPress={onToggle}
        />
        <Button title="Eliminar" color="red" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginVertical: 10,
  },
  location: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

