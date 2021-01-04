export interface Project {
  id: string;
  name: string;
  info: string;
  createdBy: string;
  created: Date;
  selectedDevs: string[];
  lastModified?: number;
}
