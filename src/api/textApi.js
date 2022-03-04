import { sendAxiosGetBase, sendAxiosPostBase } from './apiBase';

export const getTextByTextTitle = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/textApi/getTextByTitle"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const renameTextTitle = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/textApi/renameTextTitle"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/textApi/save"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const saveAsText = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/textApi/saveAs"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}

export const getTextList = (dataContainer, atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/textApi/getTextList"
    sendAxiosPostBase(url, dataContainer, atThen, atCatch, atFinally)
}
