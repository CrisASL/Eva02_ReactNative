import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../components/context/auth-context";
import NewTask from "../../components/new-task";
import TaskItem from "../../components/task-item";

export type Task = {
  id: string;
  title: string;
  imageUri: string | null;
  completed: boolean;
  location: { latitude: number; longitude: number } | null;
  userEmail: string;
};

export default function TabsScreen() {
  const auth = useContext(AuthContext);           // ✔ hook siempre arriba
  const userEmail = auth?.email ?? "";            // ✔ userEmail nunca es null
  const [tasks, setTasks] = useState<Task[]>([]); // ✔ hook arriba también

  // 🚀 Cargar tareas del usuario
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem("tasks");
        if (stored) {
          const parsed: Task[] = JSON.parse(stored);
          const userTasks = parsed.filter((t) => t.userEmail === userEmail);
          setTasks(userTasks);
        }
      } catch (error) {
        console.log("Error loading tasks", error);
      }
    };

    if (userEmail) loadTasks();
  }, [userEmail]);

  // 🚀 Guardar tareas del usuario
  useEffect(() => {
    const saveTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem("tasks");
        const globalTasks: Task[] = stored ? JSON.parse(stored) : [];

        const filtered = globalTasks.filter((t) => t.userEmail !== userEmail);
        const merged = [...filtered, ...tasks];

        await AsyncStorage.setItem("tasks", JSON.stringify(merged));
      } catch (error) {
        console.log("Error saving tasks", error);
      }
    };

    if (userEmail) saveTasks();
  }, [tasks, userEmail]);

  const handleCreateTask = (taskData: {
    title: string;
    imageUri: string | null;
    location: { latitude: number; longitude: number } | null;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      imageUri: taskData.imageUri,
      location: taskData.location,
      completed: false,
      userEmail,            // ✔ ya no falla (string garantizado)
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 🚀 Render condicional SIN romper reglas de hooks
  if (!auth) {
    return (
      <View style={styles.container}>
        <Text>Error: AuthContext no encontrado</Text>
      </View>
    );
  }

  if (!userEmail) {
    return (
      <View style={styles.container}>
        <Text>Debes iniciar sesión primero.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NewTask onCreate={handleCreateTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});





