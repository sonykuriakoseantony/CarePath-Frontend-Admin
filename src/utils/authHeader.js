export const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return {
      // "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }
  else{
    console.log("------------Not Token found------------");
    
  }

};