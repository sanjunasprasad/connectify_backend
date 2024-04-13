import { deleteOneUser } from "../../repositories/adminRepository.js"

export const deleteUser = async(id) =>{
    const response = await deleteOneUser(id)
    return response;
}