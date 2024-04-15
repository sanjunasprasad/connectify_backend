import Jwt from 'jsonwebtoken'

const JWT_KEY = '9rXq5bF2nS7zQ8'
const JWT_ADMIN_KEY = '6rXq532nS7zQ8'

export const generateUserToken = async(existingUser) => {
    try {
        const {_id } = existingUser;
        // console.log("id on auth",_id)
        const payload = {
            userId: _id,
        }
       
        const token = Jwt.sign(payload, JWT_KEY, { expiresIn: '3h' });
        console.log('userToken:', JSON.stringify(token));
        // console.log("type of user token",typeof(token))
        return token;
    } catch (error) {
        console.error("Error generating user token:", error);
        throw new Error("Failed to generate user token");
    }
}


export const decodeToken = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log("token from frontend axios header ",token)
        Jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            req.token = decodedToken;
            const Role = req.headers.role;
            // console.log("role is",Role)
            if(Role !== 'user'){
                return res.status(403).json({ message: 'Forbidden. Insufficient role.' });
            }
            next();
        });
    } catch (error) {
        console.error("Error decoding token:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const generateAdminToken = async (email) => {
    try {
        const token = Jwt.sign(email, process.env.JWT_KEY);
        // console.log('adminToken:', JSON.stringify(token));
        // console.log("type of admin token",typeof(token))
        return token;
    } catch (error) {
        console.error("Error generating admin token:", error);
        throw new Error("Failed to generate admin token");
    }
}


export const decodeAdminToken = async(req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log("token from frontend axios header :",token)
        Jwt.verify(token, JWT_ADMIN_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            req.token = decodedToken;
            const Role = req.headers.role;
            // console.log("role is",Role)
            if(Role !== 'admin'){
                return res.status(403).json({ message: 'Forbidden, Insufficient role.' });
            }
            next();
        });
    } catch (error) {
        console.error("Error decoding token:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
