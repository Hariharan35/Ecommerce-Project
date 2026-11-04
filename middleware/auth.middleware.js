const jwt=require('jsonwebtoken');
function authMiddleware(req,res,next){
    const authorization=req.headers.authorization;
    const [scheme,token]=authorization?authorization.split(' '):[];
    if(scheme!=='Bearer'|| !token){
        return res.status(401).json({message:'Please login first'});
    }
    if(!process.env.JWT_SECRET){
        return next(new Error("JWT secret is not configured"));
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message:'Invalid or Expired authorization token'})
    }
}

module.exports=authMiddleware;
