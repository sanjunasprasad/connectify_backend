import { getReportProfile} from "../../repositories/adminRepository.js"


export const getReporteduser = async () => {
  try {
    const reportedUsers = await getReportProfile();
    return reportedUsers;
  } catch (error) {
    console.error("An error occurred while fetching reported users:", error);
    return { message: "An error occurred while fetching reported users" };
  }
};
