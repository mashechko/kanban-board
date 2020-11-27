import {Dev} from './dev-interface';

export interface Task {
  id: number;
  name: string;
  priority: string;
  info: string;
  createdBy: string;
  created: Date;
  dueDate: Date;
}
