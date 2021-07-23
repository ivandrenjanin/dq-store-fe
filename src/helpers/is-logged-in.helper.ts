export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");
  console.log(token);
  if (!token) {
    return false;
  }

  return true;
};
