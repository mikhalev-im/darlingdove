import { createActions } from 'reduxsauce';
import { Order } from '../shared/interfaces/order';

interface ProfileTypes {
  LOAD_PROFILE: string;
  PROFILE_LOADED: string;
  SET_ORDERS: string;
}

export interface LoadProfileAction {
  type: 'LOAD_PROFILE';
  res: any;
}

export interface ProfileLoadedAction {
  type: 'PROFILE_LOADED';
  error?: any;
}

export interface SetOrdersAction {
  type: 'SET_ORDERS';
  orders: Order[];
}

interface ProfileActionCreators {
  loadProfile(res: any): LoadProfileAction;
  profileLoaded(err?: any): ProfileLoadedAction;
  setOrders(orders: Order[]): SetOrdersAction;
}

export default createActions<ProfileTypes, ProfileActionCreators>({
  loadProfile: ['res'],
  profileLoaded: ['error'],
  setOrders: ['orders']
});
