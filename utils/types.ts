// utils/types.ts
export interface Task {
  id: string;
  title: string;
  imageUri: string | null;
  completed: boolean;
  location?: { latitude: number; longitude: number } | null;
  userEmail: string;
}
