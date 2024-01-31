import {create} from 'zustand';
import secure from './secure';

type State = {
  initialized: boolean;
  init: () => void;
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
    if (access && refresh) {
      set({authenticated: true, tokens: {access, refresh}});
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
