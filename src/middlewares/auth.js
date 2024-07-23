import Jwt from 'jsonwebtoken'


export const generateUserToken = async(existingUser ,role) => {
    try {
        const {_id  } = existingUser;
        const payload = {
            userId: _id,
            role: role
        }
       
        const token = Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '3h' });
        console.log("user token created during login:", token)
        return token;
    } catch (error) {
        console.error("Error generating user token:", error);
        throw new Error("Failed to generate user token");
    }
}



export const decodeToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        Jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized Access' });
            }
            req.token = decodedToken;

            if (decodedToken.role !== 'user') {
                return res.status(403).json({ message: 'Forbidden. Insufficient role.' });
            }
               console.log("+++++decode tokn111 USER:",req.token)
            next();
        });
    } catch (error) {
        console.error("Error decoding token:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const generateAdminToken = async (email ,role) => {
    try {
        const payload = {
            email: email, 
            role : role
        };
        const token = Jwt.sign(payload, process.env.JWT_ADMIN_KEY);
        console.log('adminToken created during login:', JSON.stringify(token));
        return token;
    } catch (error) {
        console.error("Error generating admin token:", error);
        throw new Error("Failed to generate admin token");
    }
}






export const decodeAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("ADMIN token decoded via middleware:", token);

    Jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized Access' });
      }

      req.token = decodedToken;
      const role = decodedToken.role;

      if (role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, Insufficient role.' });
      }

      next();
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

