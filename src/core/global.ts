import {create} from 'zustand';
import secure from './secure';
import {log} from './utils';
import {URL} from './api';
import {API_BASE_URL} from '@env';
import {Asset} from 'react-native-image-picker';

type State = {
  initialized: boolean;
  init: () => Promise<void>;
  authenticated: boolean;
  user: User | null;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  login: (access: string, refresh: string, user: User) => void;
  logout: () => void;
  socket: WebSocket | null;
  socketConnect: () => void;
  socketDisconnect: () => void;
  uploadThumbnail: (file: Asset) => void;
  searchList: SearchUser[] | null;
  searchUser: (query: string) => void;
  connect: (username: string) => void;
};

const useGlobal = create<State>((set, get) => ({
  //-----------------//
  // Initialization //
  //---------------//
  initialized: false,
  init: async () => {
    const access = await secure.get('accessToken');
    const refresh = await secure.get('refreshToken');
    const user = await secure.get('user');
    if (access && refresh && user) {
      set({
        authenticated: true,
        tokens: {access, refresh},
        user: JSON.parse(user),
      });
    } else {
      set({
        authenticated: false,
        tokens: {access: null, refresh: null},
        user: null,
      });
    }
    set({initialized: true});
  },

  //------------------//
  // Authentication  //
  //----------------//

  authenticated: false,
  tokens: {
    access: null,
    refresh: null,
  },
  user: null,

  login: (access: string, refresh: string, user: User) => {
    secure.set('accessToken', access);
    secure.set('refreshToken', refresh);
    secure.set('user', JSON.stringify(user));
    set({authenticated: true, tokens: {access, refresh}, user});
  },
  logout: () => {
    secure.clear();
    set({
      authenticated: false,
      tokens: {access: null, refresh: null},
      user: null,
    });
  },

  //--------------//
  //  Websocket  //
  //------------//

  socket: null,

  socketConnect: async () => {
    const accessToken = await secure.get('accessToken');
    const refreshToken = await secure.get('refreshToken');

    const url = `ws://${API_BASE_URL}/chat/?token=${accessToken}`;
    log('Connecting to socket: ', url);

    const socket = new WebSocket(url);

    socket.onopen = () => {
      log('Socket connected');
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      log('Data: ', data);

      const responses: {
        [key: string]: (
          set: (
            partial:
              | State
              | Partial<State>
              | ((state: State) => State | Partial<State>),
            replace?: boolean | undefined,
          ) => void,
          get: () => State,
          data: User | SearchUser[],
        ) => void;
      } = {
        thumbnail: (
          set: (
            partial:
              | State
              | Partial<State>
              | ((state: State) => State | Partial<State>),
            replace?: boolean | undefined,
          ) => void,
          get: () => State,
          data: User | SearchUser[],
        ) => {
          log('Thumbnail response: ', data);
          // Thumbnail response logic
          if (Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set(state => ({user: data as User}));
          // Update user in secure storage
          secure.set('user', JSON.stringify(data));
        },
        search: (
          set: (
            partial:
              | State
              | Partial<State>
              | ((state: State) => State | Partial<State>),
            replace?: boolean | undefined,
          ) => void,
          get: () => State,
          data: User | SearchUser[],
        ) => {
          // Search response logic
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set(state => ({searchList: data as SearchUser[]}));
        },
      };

      const response = responses[data.source];
      if (!response) {
        log('Unhandled message: ', data.data);
        return;
      }
      response(set, get, data.data);
    };

    socket.onerror = e => {
      log('Socket error: ', e.message);
      const signout = get().logout;
      signout();
    };

    socket.onclose = e => {
      log('Socket closed: ', e.code, e.reason);
    };

    set(state => ({socket: socket}));
  },

  socketDisconnect: () => {
    log('Disconnecting socket');
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set(state => ({socket: null}));
  },

  //--------------//
  //  Thumbnail  //
  //------------//

  uploadThumbnail: (file: Asset) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: 'thumbnail',
        base64: file.base64,
        filename: file.fileName,
      }),
    );
  },

  //---------------//
  //    Search    //
  //-------------//

  searchList: null,

  searchUser: (query: string) => {
    if (query) {
      log('Searching for: ', query);
      const socket = get().socket;
      socket?.send(JSON.stringify({source: 'search', query}));
    } else {
      set(state => ({searchList: null}));
    }
  },

  //------------------------//
  //  Send connect request //
  //----------------------//

  connect: (username: string) => {
    const socket = get().socket;
    socket?.send(JSON.stringify({source: 'request-connect', username}));
  },
}));
export default useGlobal;
