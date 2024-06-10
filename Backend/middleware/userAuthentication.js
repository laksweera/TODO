import jwt from 'jsonwebtoken';
import  {User}  from "../models/model.js";


const userAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, process.env.SECRET);
    req.userId = await User.findByPk(userId);
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export default userAuthentication;