/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { getNewAccessToken, isAccessTokenExist } from "@/service/refreshToken";
import { jwtutils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
    success: true,
    statusCode: number,
    message: string,
    data: Record<string, any>
}
/*
data:{
title
content}
*/
export const createPost = async (prevState: PostState, formData: FormData) => {
    console.log({
        title: formData.get("title"),
        content: formData.get("content"),
        thumbnail: formData.get("thumbnail"),
        tags: (formData.get("tags") as string).split(","),
        isFeatured: formData.get("isFeatured"),
        isPremium: formData.get("isPremium") === "on",

    });

    const payload = {
        title: formData.get("title"),
        content: formData.get("content"),
        thumbnail: formData.get("thumbnail"),
        tags: (formData.get("tags") as string).split(","),
        isFeatured: formData.get("isFeatured") === "on",
        isPremium: formData.get("isPremium") === "on",
    }

    const cookieStore = await cookies()

    let accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

       if (!accessToken && !refreshToken) {
        throw new Error("User not logged in")
        // return {
        //     success: false,
        //     message: "User not logged in"
        // }
    }
    
    accessToken = await isAccessTokenExist() as string;

    // const decodedAccessToken = accessToken ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    // const decodedRefreshToken = refreshToken ? jwtutils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;
    
    // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    //     // access token has expired but refresh token is valid, refresh the access token
    //     const result = await getNewAccessToken();
    
    //     if (result.success) {
    //       // set the new access token in the cookies
    //       const newAccessToken = result.data.accessToken;
    //       cookieStore.set("accessToken", newAccessToken, {
    //         httpOnly: true,
    //         maxAge: 60 * 60 * 24, // 1 day
    //         sameSite: "lax",
    //       });
    
    //       accessToken = newAccessToken;
    //     }
    
    //   }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
        method: "POST",
        headers: {
            // Authorization: accessToken as unknown as string
            // Authorization: `${accessToken}`,
            // Authorization: `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (result.success) {
        revalidateTag("my-posts", {
            expire: 0     //instant show korbe
        })
    }
    if (result.success && result.data.isPremium) {
        revalidateTag("premium-posts", {
            expire: 0
        })
    } else {
        revalidateTag("public-posts", {
            expire: 0
        })
    }
    console.log(result);
    return result;
}

export const updatePost = async (postId: string, authorId: string, prevState: PostState, formData: FormData) => {

    console.log(postId);
    console.log(authorId);
    console.log({
        title: formData.get("title"),
        content: formData.get("content"),
        thumbnail: formData.get("thumbnail"),
        tags: (formData.get("tags") as string).split(","),
        isFeatured: formData.get("isFeatured"),
        isPremium: formData.get("isPremium") === "on",

    });

    const payload = {
        title: formData.get("title") ?? "",
        content: formData.get("content") ?? "",
        thumbnail: formData.get("thumbnail") ?? "",
        tags: (formData.get("tags") as string).split(",") ?? "",
        isFeatured: formData.get("isFeatured") === "on",
        isPremium: formData.get("isPremium") === "on",
    }

    const cookieStore = await cookies()

    let accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

       if (!accessToken && !refreshToken) {
        throw new Error("User not logged in")
        // return {
        //     success: false,
        //     message: "User not logged in"
        // }
    }
    accessToken = await isAccessTokenExist() as string;
    // const cookieStore = await cookies()

    // let accessToken = cookieStore.get("accessToken")?.value || null;
    // const refreshToken = cookieStore.get("refreshToken")?.value || null;

    //    if (!accessToken && !refreshToken) {
    //     // throw new Error("User not logged in")
    //     return {
    //         success: false,
    //         message: "User not logged in"
    //     }
    // }


    // const decodedAccessToken = accessToken ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    // const decodedRefreshToken = refreshToken ? jwtutils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;
    
    // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    //     // access token has expired but refresh token is valid, refresh the access token
    //     const result = await getNewAccessToken();
    
    //     if (result.success) {
    //       // set the new access token in the cookies
    //       const newAccessToken = result.data.accessToken;
    //       cookieStore.set("accessToken", newAccessToken, {
    //         httpOnly: true,
    //         maxAge: 60 * 60 * 24, // 1 day
    //         sameSite: "lax",
    //       });
    
    //       accessToken = newAccessToken;
    //     }
    
    //   }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
            // Authorization: accessToken as unknown as string
            // Authorization: `${accessToken}`,
            // Authorization: `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (result.success) {
        revalidateTag("my-posts", {
            expire: 0     //instant show korbe
        })
    }
    if (result.success && result.data.isPremium) {
        revalidateTag("premium-posts", {
            expire: 0
        })
    } else {
        revalidateTag("public-posts", {
            expire: 0
        })
    }
    console.log(result);
    return result;
}

export const getMyposts = async () => {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        // throw new Error("User not logged in")
        return {
            success: false,
            message: "User not logged in"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
        headers: {
            // Authorization: accessToken as unknown as string
            // Authorization: `${accessToken}`,
            // Authorization: `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`
        },

        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24,
            tags: ["my-posts"]
        }
    })

    const result = await res.json()
    console.log(result);
    return result;
}