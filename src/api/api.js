// import axios from "axios";

export const BACKEND_URL = "http://192.168.1.16:8888"

export const fn_getBanksByTabApi = async (tab) => {
    try {
        const data = {
            accountType: tab,
            website: window.location.origin
        }
        return data;
    } catch (error) {
        console.log("fn_getBanksByTab ", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong" }
        }
        return { status: false, message: "Network error" };
    }
}