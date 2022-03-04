import { sendAxiosGetBase, sendAxiosPostBase } from "./apiBase";


export const signUpUser = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/signupApi/signUpuser";
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const signInUser = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/signinApi/signInUser";
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
