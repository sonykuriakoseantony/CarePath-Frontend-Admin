
import commonAPI from "./commonAPI"
import serverURL from "./serverURL"

//Register API - called by Auth component when Register button is clciked
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/register`, reqBody);
}

//Login API - called from Login page when Login form submitted
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/login`, reqBody);
}

// get all users by admin
export const getAllUsersAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/users/all`, {}, reqHeader);
}

// add user API
export const addUserAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/user/add`, reqBody, reqHeader);
}

// edit user API
export const editUserAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/user/${id}/edit`, reqBody, reqHeader);
}

// view user API
export const viewUserAPI = async (id, reqHeader) => {
    return await commonAPI("GET", `${serverURL}/user/${id}`, {}, reqHeader);
}

// delete user API
export const removeUserAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${serverURL}/user/${id}/delete`, {}, reqHeader);
}



