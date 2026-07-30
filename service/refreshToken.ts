"use server"

import { jwtutils } from "@/utils/jwt";
import { cookies } from "next/headers"

export const getNewAccessToken = async () => {
    const cookieStore = await cookies()

    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!refreshToken) {
        // throw new Error("User not logged in")
        return {
            success: false,
            message: "Refresh token not found"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {

            Cookie: `refreshToken=${refreshToken}`
        },

        cache: "no-cache",
    })

    const result = await res.json()
    console.log(result);
    return result;
}


export const isAccessTokenExist = async () => {

     const cookieStore = await cookies()
    let accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!accessToken && !refreshToken) {
        // throw new Error("User not logged in")
        return {
            success: false,
            message: "User not logged in"
        }
    }


    const decodedAccessToken = accessToken ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    const decodedRefreshToken = refreshToken ? jwtutils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        // access token has expired but refresh token is valid, refresh the access token
        const result = await getNewAccessToken();

        if (result.success) {
            // set the new access token in the cookies
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: "lax",
            });

            accessToken = newAccessToken;
        }

    }

    return accessToken;
}