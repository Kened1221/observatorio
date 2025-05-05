export type UserRecord = {
  id: string;
  name: string;
  active: number;
  dni?: string;
  date_inactive?: string;
  role?: string;
  modulos: string[];
};
