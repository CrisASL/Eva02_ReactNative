import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  imageUri: string | null;
  completed: boolean;
  location?: { latitude: number; longitude: number } | null;
  userEmail: string;
}

// Clave donde se guardarán las tareas
const STORAGE_KEY = "TASKS_V1";

async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    console.log("Error guardando tareas:", err);
  }
}

export async function getTasks(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.log("Error leyendo tareas:", err);
    return [];
  }
}

export async function addTask(task: Task): Promise<void> {
  const tasks = await getTasks();
  const updated = [...tasks, task];
  await saveTasks(updated);
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks();
  const updated = tasks.filter((t) => t.id !== id);
  await saveTasks(updated);
}

export async function updateTask(
  id: string,
  newData: Partial<Task>
): Promise<void> {
  const tasks = await getTasks();

  const updated = tasks.map((t) =>
    t.id === id ? { ...t, ...newData } : t
  );

  await saveTasks(updated);
}
