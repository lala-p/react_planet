import { sendAxiosGetBase, sendAxiosPostBase } from "./apiBase";


export const signupUser = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/signup/user";
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
