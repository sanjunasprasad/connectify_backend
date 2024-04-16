import {checkLogin} from '../../usecases/AdminUseCases/checkAdmin.js'
import { getUsers  } from '../../usecases/AdminUseCases/getUsers.js';
import {blockUsers} from '../../usecases/AdminUseCases/blockUsers.js'
import { deleteUser } from '../../usecases/AdminUseCases/deleteUser.js';
import {getReporteduser} from '../../usecases/AdminUseCases/getReportUser.js'
import {deactivate} from '../../usecases/AdminUseCases/deactivateUser.js'

export const adminLogin = async(req, res) => {
    try{
        const {email, password} = req.body;
        const adminData = await checkLogin(email, password);
        return res.json(adminData);
    }catch(err){
        console.log(err)
    }
}


export const loadUsers = async(req, res) =>{
    try{
        const userData = await getUsers()
        return res.json(userData)
    }catch(err){
        console.log(err);
    }
}


export const userBlock = async (req,res) =>{
    try {
       
        const { id } = req.params;
        const { is_blocked } = req.body;
        const response = await blockUsers(id, is_blocked)
        // console.log("response from  for block",response)
        if(!id){
            return res.status(400).json("id not found")
        }
        if (response !== undefined) {
            return res.status(200).json({message:"User status updated successfully" });
          } else {
            return res.status(404).json({ message: "User not found or other error occurred" });
          }
      } catch (error) {
        res.status(500).send('Internal server error');
      }
  }


  export const deleteuser = async (req,res) =>{
    try{
        const userId = req.params.id;
        const response = await deleteUser(userId);
        res.json(response)
    }catch(err){
        console.log(err);
        res.json({message:"Couldnt delete the user"})
    }
}


export const listReportuser = async(req,res) =>{
    try {
        
        const reportedUsers = await getReporteduser()
        // console.log("from controller",reportedUsers)
        res.status(200).json(reportedUsers);
      } catch (error) {
        console.error('Error fetching reported users:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


export const deactivateUser = async(req,res) => {
  try {
    const { id } = req.params;
    console.log("id id ",id)
    const { status } = req.body;
    console.log("status is",status)
    const user = await deactivate(id, status); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User status updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  }
  