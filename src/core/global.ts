import {create} from 'zustand';

type GlobalState = {
  authenticated: boolean;
  auth: Authentication | null;
  login: (auth: Authentication) => void;
  logout: () => void;
};

const useGlobal = create<GlobalState>(set => ({
  //------------------//
  // Authentication  //
  //----------------//

  authenticated: false,
  auth: null,

  login: (auth: Authentication) => set({authenticated: true, auth}),
  logout: () => set({authenticated: false, auth: null}),
}));

export default useGlobal;
