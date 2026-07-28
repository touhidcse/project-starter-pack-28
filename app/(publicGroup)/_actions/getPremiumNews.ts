"use server"

import { cookies } from "next/headers";

export const getPremiumNews = async ({query } : { query?: { [key: string]: string | string[] | undefined } }) => {

    // Bad Approach
    // const searchTerm = `${search?.searchTerm ? `?searchTerm=${search.searchTerm}` : ""}`;

    // JavaScript class URLSearchParams is used to create and manipulate the query string of a URL. 
    // It provides methods to easily add, retrieve, and delete query parameters. In this code snippet, we are using URLSearchParams to construct the query string for the API request based on the provided search parameters.
    const params = new URLSearchParams()

    if(query && query.searchTerm){
        params.set("searchTerm", query.searchTerm as string)
    }

    //  /premium?searchTerm=nextjs
     const cookieStore = await cookies();
    
        const accessToken = cookieStore.get("accessToken")?.value || null;
    
        if(!accessToken){
            // throw new Error("User Not Logged In!");
    
            return {
                success : false,
                message : "User not logged in!"
            }
        }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium?${params.toString()}`, {
        headers: {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`
        },
        cache : "no-cache",
        next : {
            revalidate : 60 * 60 * 6,
            tags : ["premium-posts"]
        }
    });

    const result = await res.json();

    return result;
}