
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

// edit user API
export const editUserAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/user/${id}/edit`, reqBody, reqHeader);
}

// get all users by admin
export const getAllUsersAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/users/all`, {}, reqHeader);
}

