import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import NewTask from "../../components/new-task";
import TaskItem from "../../components/task-item";

export type Task = {
  id: string;
  title: string;
  imageUri: string | null;
  completed: boolean;
  location: { latitude: number; longitude: number } | null;
};

export default function TabsScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

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
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

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



