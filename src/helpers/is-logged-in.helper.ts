export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return false;
  }

  return true;
};
