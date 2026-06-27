export interface Notification {
  id: string;
  week: number;
  type: 'transfer' | 'injury' | 'info';
  title: string;
  message: string;
  read: boolean;
}
