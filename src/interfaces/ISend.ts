import { IUser } from './IUser';

export interface ISend {
  from: IUser;
  room: unknown;
  data: unknown;
  persistData?: boolean;
}
