export const wordFill = (str, len, word) => {

    let returnWord = str;
    for (let index = str.length; index < len; index++) {
        returnWord = word + returnWord;
    }

    return returnWord;
}
