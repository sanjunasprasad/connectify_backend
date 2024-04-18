import Jwt from 'jsonwebtoken'


export const generateUserToken = async(existingUser) => {
    try {
        const {_id } = existingUser;
        // console.log("id on auth",_id)
        const payload = {
            userId: _id,
        }
       
        const token = Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '3h' });
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
        let token = null
        console.log("USER HEADER",req.headers)
        const header = req.headers.authorization
        if (header !== undefined ){
             token = header.split(" ")[1]
            console.log("USER TOKEN in decode:: ",token)
        }
        const Role = req.headers.role;
        console.log("USER ROLE is in decode:",Role)
        if( !token || Role !== 'user'){
            return res.status(403).json({ message: 'Forbidden. Insufficient role.' });
        }
        
        Jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            req.token = decodedToken;
            // console.log("decode tokn111 USER:",req.token)
            next();
        });

    } catch (error) {
        console.error("Error decoding token 1111USER:", error);
        return res.status(500).json({ message: 'Internal Server Error1111USER' });
    }
}


export const generateAdminToken = async (email) => {
    try {
        const token = Jwt.sign(email, process.env.JWT_ADMIN_KEY);
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
        console.log("ADMIN token  :",token)
        Jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            req.token = decodedToken;
            const Role = req.headers.role;
            console.log("ROLE  is",Role)
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
