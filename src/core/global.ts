import {create} from 'zustand';
import secure from './secure';

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
};

const useGlobal = create<State>(set => ({
  //------------------//
  // Initialization  //
  //----------------//
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
}));

export default useGlobal;
