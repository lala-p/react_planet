import { sendAxiosGetBase, sendAxiosPostBase } from './apiBase';

export const serverConnect = (atThen, atCatch, atFinally) => {
    const url = "http://localhost:3001/"
    sendAxiosGetBase(url, atThen, atCatch, atFinally)
}
