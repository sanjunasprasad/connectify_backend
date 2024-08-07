import {Router} from 'express';
const adminRoute = Router();
import { decodeAdminToken } from '../../middlewares/auth.js';
import { adminLogin ,loadUsers, userBlock,deleteuser,listReportuser,deactivateUser,getPosts} from '../controllers/adminControllers.js';


adminRoute.post('/adminLogin', adminLogin);
adminRoute.get('/loadUsers',decodeAdminToken, loadUsers);
adminRoute.post('/blockuser/:id', decodeAdminToken,userBlock);
adminRoute.delete('/adminDeleteUser/:id', decodeAdminToken,deleteuser);
adminRoute.get('/listReportuser',decodeAdminToken,listReportuser)
adminRoute.post('/deactivateUser/:id',decodeAdminToken,deactivateUser)
adminRoute.get('/getPosts',decodeAdminToken,getPosts)


export default adminRoute;