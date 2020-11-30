export interface Task {
  id: number;
  name: string;
  info: string;
  status?: string;
  createdBy: string;
  priority?: string;
  created: Date;
  dueDate: Date;
}
