import { sendAxiosGetBase, sendAxiosPostBase } from "./apiBase";


export const signinUser = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/signin/user";
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
