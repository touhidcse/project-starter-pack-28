

/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt  from "jsonwebtoken"



const verifyToken =  (token: string, secret: string) => {
    try {
        const verifidToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifidToken
        }
    } catch (error : any) {
        console.log("token verification failed",error);
        return {
            success: false,
            error: error.message
        }
    }
}
export const jwtutils = {
    verifyToken
}