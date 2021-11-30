export const findVer01 = {
    baseLine: {
        weekLine     : /(?<=-{35})\s*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\s*(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g,
        dateStartLine: /={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g,
        dateEndLine  : /\-{35}/g,
        planLine     : /\d{1,2}\.{1}\s{1}/g,
        etcLine      : /\+{1}/g,  
    },

    date: /(?<=\={3}\s)\d{4}\/\d{2}\/\d{2}(?=\s\={20})/g,
    
}
