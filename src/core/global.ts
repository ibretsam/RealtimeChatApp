import {create} from 'zustand';
import secure from './secure';
import {log} from './utils';
import {DEBUG, URL} from './api';
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
  accept: (username: string) => void;
  requestList: Connection[] | null;
  friendList: MessagePreview[] | null;
  messageTyping: (preview: MessagePreview) => void;
  messageNext: number;
  messageSend: (
    message: string,
    image: Asset | null,
    connection: MessagePreview,
  ) => void;
  messagesList: Message[] | null;
  messagesTyping: Date | null;
  messageUser: User | null;
  messageList: (connection: MessagePreview, page?: number) => void;
  imagesList: string[] | null;
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

    const url = `${DEBUG ? 'ws' : 'wss'}://${URL}/chat/?token=${accessToken}`;
    log('Connecting to socket: ', url);

    const socket = new WebSocket(url);

    socket.onopen = () => {
      log('Socket connected');

      socket.send(JSON.stringify({source: 'request-list'}));
      socket.send(JSON.stringify({source: 'friend-list'}));
    };

    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      log('Data: ', data);

      type SetState = (
        partial:
          | State
          | Partial<State>
          | ((state: State) => State | Partial<State>),
        replace?: boolean | undefined,
      ) => void;

      type ResponseData =
        | User
        | SearchUser[]
        | Connection
        | Message[]
        | Message
        | MessageData
        | MessagePreview;

      const responses: {
        [key: string]: (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => void;
      } = {
        thumbnail: (set: SetState, get: () => State, data: ResponseData) => {
          log('Thumbnail response: ', data);
          // Thumbnail response logic
          if (Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set(state => ({user: data as User}));
          // Update user in secure storage
          secure.set('user', JSON.stringify(data));
        },
        search: (set: SetState, get: () => State, data: ResponseData) => {
          // Search response logic
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set((state: State) => ({searchList: data as SearchUser[]}));
        },
        'request-connect': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          log('Request connect response: ', data);
          const user = get().user;

          if ('sender' in data && 'receiver' in data) {
            if (user?.username == data.sender.username) {
              log('Sender is the current user');
              const searchList = [...get().searchList!];
              log('Search list: ', searchList);
              const index = searchList.findIndex(
                user => user.username === data.receiver.username,
              );
              log('Index: ' + index);
              if (index >= 0) {
                searchList[index].status = 'pending-me';
                set(state => ({searchList}));
                log('Search list updated: ', searchList);
              }
            } else {
              const requestList = [...get().requestList!];
              const index = requestList.findIndex(
                user => user.sender.username === data.sender.username,
              );
              if (index < 0) {
                requestList.unshift(data);
                set(state => ({requestList}));
              }
            }
          }
        },
        'request-list': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          log('Request list response: ', data);
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set(state => ({requestList: data as unknown as Connection[]}));
        },
        'request-accept': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          log('Request accept response: ', data);
          const user = get().user;
          if ('receiver' in data && user?.username == data.receiver.username) {
            log('Receiver is the current user');
            if (data.accepted) {
              const requestList = [...get().requestList!];
              const index = requestList.findIndex(
                user => user.sender.username === data.sender.username,
              );
              if (index >= 0) {
                requestList.splice(index, 1);
                set(state => ({requestList}));
              }

              // Update search list
              if (get().searchList) {
                const searchList = [...get().searchList!];
                const index2 = searchList.findIndex(
                  user => user.username === data.sender.username,
                );
                if (index2 >= 0) {
                  searchList[index2].status = 'connected';
                  set(state => ({searchList}));
                }
              }
            }
          }
        },
        'friend-list': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          log('Friend list response: ', data);
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
          }
          set(state => ({friendList: data as unknown as MessagePreview[]}));
        },
        'friend-new': (set: SetState, get: () => State, data: ResponseData) => {
          data = data as MessagePreview;
          log('New friend response: ', data);
          const friendList = [data, ...get().friendList!];
          set(state => ({friendList: friendList}));
        },
        'message-list': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          data = data as MessageData;
          const messages = data.messages as Message[];
          const next = data.next;
          const user = data.user;
          log('Message list response: ', data);
          if (!Array.isArray(data.messages)) {
            throw new Error('Invalid data format');
          }
          set((state: State) => {
            const updatedImagesList = state.messagesList
              ? state.messagesList
                  .filter(message => message.image_url)
                  .map(message => message.image_url!)
              : [];
            return {
              messagesList: [...state.messagesList!, ...messages],
              messageNext: next,
              messageUser: user,
              imagesList: updatedImagesList,
            };
          });
        },
        'message-send': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          log('Message send response: ', data);
          data = data as MessageData;
          const message = data.messages as Message;
          const sender = data.user;

          const friendList = [...get().friendList!];
          const index = friendList.findIndex(
            item => item.friend.username === sender.username,
          );
          log('Friend list: ', friendList);
          log('Index: ' + index);

          if (index >= 0) {
            const friend = friendList[index];
            friend.preview = message.content;
            friend.updated_at = message.created_at;
            friendList.splice(index, 1);
            friendList.unshift(friend);

            set(state => ({friendList}));
          }

          // if (sender.username !== get().messageUser?.username) {
          //   return;
          // }

          const messagesList = [message, ...get().messagesList!];
          set(state => ({messagesList, messagesTyping: null}));
        },
        'message-typing': (
          set: SetState,
          get: () => State,
          data: ResponseData,
        ) => {
          data = data as ResponseData & {username: string};
          log('Message typing response: ', data);
          // if (data.username !== get().messageUser?.username) return;

          set(state => ({
            messagesTyping: new Date(),
          }));
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

  requestList: null,

  connect: (username: string) => {
    const socket = get().socket;
    socket?.send(JSON.stringify({source: 'request-connect', username}));
  },

  accept: (username: string) => {
    const socket = get().socket;
    socket?.send(JSON.stringify({source: 'request-accept', username}));
  },

  //----------------//
  //  Friend List  //
  //--------------//
  friendList: [],

  //----------------//
  //  Message Send  //
  //----------------//
  messageSend: (
    message: string,
    image: Asset | null,
    connection: MessagePreview,
  ) => {
    const socket = get().socket;
    if (image) {
      socket?.send(
        JSON.stringify({
          source: 'message-send',
          message_type: 'image',
          message,
          connectionId: connection.id,
          senderId: get().user?.id,
          image: image.base64,
          filename: image.fileName,
        }),
      );
    } else {
      socket?.send(
        JSON.stringify({
          source: 'message-send',
          message_type: 'text',
          message,
          connectionId: connection.id,
          senderId: get().user?.id,
        }),
      );
    }
  },

  //----------------//
  //  Message List  //
  //----------------//
  messagesList: [],
  messagesTyping: null,
  messageNext: 0,
  messageUser: null,
  messageList: (connection: MessagePreview, page: number = 0) => {
    if (page === 0) {
      set({
        messagesList: [],
        messageNext: 0,
        messagesTyping: null,
        messageUser: null,
      });
    } else {
      set({messageNext: 0});
    }

    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: 'message-list',
        connectionId: connection.id,
        page,
      }),
    );
  },
  imagesList: [],

  //------------------//
  //  Message Typing  //
  //------------------//
  messageTyping: (preview: MessagePreview) => {
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: 'message-typing',
        username: preview.friend.username,
      }),
    );
  },
}));
export default useGlobal;
