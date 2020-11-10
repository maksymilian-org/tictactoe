export interface GlobalStore {
  language: string;
  theme: string;
}

const reducer = (
  state: GlobalStore = {
    language: 'en-US',
    theme: 'light'
  },
  action
) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.language
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    default:
      return state;
  }
};

export default reducer;
