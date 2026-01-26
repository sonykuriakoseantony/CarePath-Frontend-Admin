export const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");

  return {
    // "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};