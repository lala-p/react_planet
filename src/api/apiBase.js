import axios from "axios";



export const sendAxiosPostBase = (url, dataContainer, atThen = false, atCatch = false, atFinally = false) => {

    axios
        .post(url, dataContainer)
        .then((response) => {
            if (atThen) {
                atThen(response)
            }
        })
        .catch((error) => {
            if (atCatch) {
                atCatch(error)
            }
        })
        .finally(() => {
            if (atFinally) {
                atFinally()
            }
        })
}


export const sendAxiosGetBase = (url, atThen = false, atCatch = false, atFinally = false) => {

    axios
        .get(url)
        .then((response) => {
            if (atThen) {
                atThen(response)
            }
        })
        .catch((error) => {
            if (atCatch) {
                atCatch(error)
            }
        })
        .finally(() => {
            if (atFinally) {
                atFinally()
            }
        })

}
