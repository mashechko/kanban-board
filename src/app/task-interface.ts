import {Dev} from './dev-interface';

export interface Task {
  id: number;
  name: string;
  priority: string;
  info: string;
  createdBy: Dev;
  created: Date;
  dueDate: Date;
}
