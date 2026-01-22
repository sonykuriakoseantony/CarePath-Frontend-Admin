import axios from "axios";

const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {

    const reqConfigure = {
        method : httpMethod,
        url,
        data : reqBody,
        headers : reqHeader ? reqHeader : {'Content-Type' : 'application/json'}
    }
    return await axios(reqConfigure).then((res)=>res).catch((err)=>err); //there should be no body for arrow function for it is to be returned. Else we will have to explicitly give return statement.
}

export default commonAPI;