//GET INITIAL THEME HELPER
export const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('darkTheme');
    if (storedTheme !== null) {
      return JSON.parse(storedTheme);
    }
    localStorage.setItem('darkTheme', JSON.stringify(true));
    return true;
  }
  return true;
};
