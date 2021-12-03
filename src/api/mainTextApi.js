import { sendAxiosGetBase, sendAxiosPostBase } from './apiBase';

export const getMainText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/main/getText"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveMainText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/main/saveText"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

