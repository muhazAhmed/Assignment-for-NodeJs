const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token)
            return res.status(401).json({ status: false, msg: "token is required" });
        let btoken=token.split(" ")

        jwt.verify(btoken[1],"secret", (error, decoded) =>{

            if (error) {
               let message=(error.message=="jwt expired"?"token is expired,please login again":"token is invalid,not authenticated")
                 return res.status(401).json({ status: false, msg:message });
            } else {
              req.token = decoded;

                next(); }
        });
    } catch (error) {
        return res.status(500).json({ status: false, err: error.message });
    }
};


module.exports={authentication}