import {Task} from './task-interface';

export const TASKS: Task[] = [
  {
    id: 1,
    name: 'Mauris maximus euismod',
    priority: 'High priority',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac placerat justo. Morbi cursus sagittis dictum. Sed consequat congue cursus. Quisque nisi neque, iaculis vel.',
    createdBy: 'Masha Levchuk',
    created: new Date('2020-11-20'),
    dueDate: new Date('2020-12-20'),
  },
  {
    id: 2,
    name: 'Lorem ipsum dolor sit amet',
    priority: 'Med priority',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac placerat justo. Morbi cursus sagittis dictum. Sed consequat congue cursus. Quisque nisi neque, iaculis vel.',
    createdBy: 'Masha Levchuk',
    created: new Date('2020-11-20'),
    dueDate: new Date('2020-12-20'),
  },
  {
    id: 3,
    name: 'Mauris maximus euismod',
    priority: 'Low priority',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac placerat justo. Morbi cursus sagittis dictum. Sed consequat congue cursus. Quisque nisi neque, iaculis vel.',
    createdBy: 'Masha Levchuk',
    created: new Date('2020-11-20'),
    dueDate: new Date('2020-12-20'),
  },
];
