import axios from "axios";

export const BACKEND_URL = "http://192.168.1.2:8888"

export const fn_getBanksByTabApi = async (tab) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/bank/user?accountType=${tab}&website=${window.location.origin}`);
        if (response?.status === 200) {
            if (response?.data?.status === "ok") {
                return { status: true, data: response?.data?.data }
            }
        }
    } catch (error) {
        console.log("fn_getBanksByTabApi ", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong" }
        }
        return { status: false, message: "Network error" };
    }
}

export const fn_uploadTransactionApi = async (formData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/ledger/create`, formData);
        if (response?.status === 200) {
            if (response?.data?.status === "ok") {
                return { status: true, data: response?.data }
            }
        }
    } catch (error) {
        console.log("fn_getBanksByTabApi ", error);
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message || "Something went wrong" }
        }
        return { status: false, message: "Network error" };
    }
}