
//aici creem o functia ca verifica error response si data.message daca exista sa returneze acea data sau doara erorr.message

export const getError = (error)=>{
    return error.response && error.response.data.message
    ?error.response.data.message
    :error.message
}