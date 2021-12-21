import { sendAxiosGetBase, sendAxiosPostBase } from './apiBase';

export const getCurrentText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/get/current"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const getTextByTitle = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/get/current"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveCurrentText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/save/current"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveTextByTitle = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/save/byTitle"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const getTextList = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/get/textList"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
