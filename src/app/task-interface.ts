export interface Task {
  id: string;
  name: string;
  info: string;
  status?: string;
  createdBy: string;
  priority?: string;
  created: Date;
  dueDate: Date;
  assignedTo?: string;
  attachments?: string[];
  comments?: string[];
}
