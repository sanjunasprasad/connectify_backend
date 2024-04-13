import { getAllUsers} from "../../repositories/adminRepository.js"

export const getUsers = async () =>{
    const userData = await getAllUsers()
    return userData;
}
