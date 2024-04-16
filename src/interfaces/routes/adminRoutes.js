import {Router} from 'express';
const adminRoute = Router();
import { decodeAdminToken } from '../../middlewares/auth.js';
import { adminLogin ,loadUsers, userBlock,listReportuser,deactivateUser} from '../controllers/adminControllers.js';


adminRoute.post('/adminLogin', adminLogin);
adminRoute.get('/loadUsers',decodeAdminToken, loadUsers);
adminRoute.patch('/blockuser/:id', decodeAdminToken,userBlock);
// adminRoute.delete('/adminDeleteUser/:id', decodeAdminToken,deleteuser);
adminRoute.get('/listReportuser',decodeAdminToken,listReportuser)
adminRoute.patch('/deactivateUser/:id',decodeAdminToken,deactivateUser)


export default adminRoute;