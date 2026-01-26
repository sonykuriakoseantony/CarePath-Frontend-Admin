
import commonAPI from "./commonAPI"
import serverURL from "./serverURL"

// ---------------Auth API---------------------
//Register API - called by Auth component when Register button is clciked
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/register`, reqBody);
}

//Login API - called from Login page when Login form submitted
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST", `${serverURL}/login`, reqBody);
}

// --------------User CRUD by Admin-----------------
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

// --------------------Departments CRUD------------------------
// get all Department by admin
export const getAllDepartmentsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/departments/all`, {}, reqHeader);
}

// add Department API
export const addDepartmentAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/department/add`, reqBody, reqHeader);
}

// edit Department API
export const editDepartmentAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/department/${id}/edit`, reqBody, reqHeader);
}


// delete Department API
export const removeDepartmentAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${serverURL}/department/${id}/delete`, {}, reqHeader);
}

// --------------------Doctors CRUD------------------------
// get all Doctors by admin
export const getAllDoctorsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/doctors/all`, {}, reqHeader);
}

// add Doctor API
export const addDoctorAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/doctor/add`, reqBody, reqHeader);
}

// edit Doctor API
export const editDoctorAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/doctor/${id}/edit`, reqBody, reqHeader);
}

// view user API
export const viewDoctorAPI = async (id, reqHeader) => {
    return await commonAPI("GET", `${serverURL}/doctor/${id}`, {}, reqHeader);
}

// delete Doctor API
export const removeDoctorAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${serverURL}/doctor/${id}/delete`, {}, reqHeader);
}


// --------------------Rules CRUD------------------------
// get all Rules by admin
export const getAllRulesAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/rules/all`, {}, reqHeader);
}

// add Doctor API
export const addRuleAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${serverURL}/rule/add`, reqBody, reqHeader);
}

// edit Doctor API
export const editRuleAPI = async (id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/rule/${id}/edit`, reqBody, reqHeader);
}

// view user API
export const viewRuleAPI = async (id, reqHeader) => {
    return await commonAPI("GET", `${serverURL}/rule/${id}`, {}, reqHeader);
}

// delete Doctor API
export const removeRuleAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${serverURL}/rule/${id}/delete`, {}, reqHeader);
}

// --------------------Fetch Symptoms------------------------
// get all Symptoms by admin
export const getAllSymptomsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${serverURL}/symptoms/all`, {}, reqHeader);
}

// update Symptom by admin
export const updateSymptomAPI = async(id, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${serverURL}/symptom/${id}/update`, reqBody, reqHeader)
}
