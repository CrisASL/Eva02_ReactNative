import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../utils/types"; // Ajusta según tu ruta de Task

const TASKS_KEY = "tasks";

// Guardar todas las tareas (global)
export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.log("Error guardando tareas:", error);
  }
}

// Obtener todas las tareas (global)
export async function getTasks(): Promise<Task[]> {
  try {
    const stored = await AsyncStorage.getItem(TASKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.log("Error obteniendo tareas:", error);
    return [];
  }
}
