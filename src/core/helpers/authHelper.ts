import {auth} from "@/core/auth/firebase.ts";

export async function authFetch(
    input: RequestInfo,
    init: RequestInit = {}
) {
    const token = await auth.currentUser?.getIdToken();

    if (!token)
        return null;

    return fetch(input, {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
}