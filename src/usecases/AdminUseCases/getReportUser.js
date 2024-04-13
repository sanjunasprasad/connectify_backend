import { getReportProfile} from "../../repositories/adminRepository.js"

export const getReporteduser = async () =>{
    const reportedUsers = await getReportProfile()
    return  reportedUsers
}
