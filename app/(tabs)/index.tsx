import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../components/context/auth-context";
import NewTask from "../../components/new-task";
import TaskItem from "../../components/task-item";
import { getTasks, saveTasks } from "../../utils/storage";
import { Task } from "../../utils/types";

export default function TabsScreen() {
  const auth = useContext(AuthContext);
  const userEmail = auth?.email ?? "";
  const [tasks, setTasks] = useState<Task[]>([]);

  // Cargar tareas del usuario al iniciar sesión
  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await getTasks(); // todas las tareas
      const userTasks = allTasks.filter((t) => t.userEmail === userEmail);
      setTasks(userTasks);
    };
    if (userEmail) loadTasks();
  }, [userEmail]);

  // Guardar tareas del usuario al modificarlas
  useEffect(() => {
    const persistTasks = async () => {
      const allTasks = await getTasks(); // todas las tareas
      const otherUsersTasks = allTasks.filter((t) => t.userEmail !== userEmail);
      const merged = [...otherUsersTasks, ...tasks]; // unir tareas
      await saveTasks(merged);
    };
    if (userEmail) persistTasks();
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
      userEmail,
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






