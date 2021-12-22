import { sendAxiosGetBase, sendAxiosPostBase } from './apiBase';

export const getTextByTextTitle = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/get/byTextTitle"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/save"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const getTextList = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/text/get/textList"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
