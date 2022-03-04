export const findVer01 = {
    global: {
        baseLine: {
            weekLine     : /(?<=-{35})\s*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\s*(?=\={3}\s\d{4}\/\d{2}\/\d{2}\s\={20})/g,
            dateStartLine: /={3}\s\d{4}\/\d{2}\/\d{2}\s\={20}/g,
            dateEndLine  : /\-{35}/g,
            planLine     : /\d{1,2}\.{1}\s{1}/g, // 지우기 
            etcLine      : /\+{1}/g, // 지우기
        },
        rules: {
            plan      : /\d{1,2}\.{1}\s{1}/g,
            etc       : /\+{1}/g,  
            info      : /\t{3}-{1}/g,
            conclusion: /=>/g, 
            graffiti  : /~\n/g
        },
        find: {
            planSuccess: /\sO\s*/ig,
            planFailed : /\sX\s*/ig,
            planDelay  : /->+(?!\*+)/g,
            planSomeday: /->\*/g,
            state      : /\sO\s*|\sX\s*|->+|->\*/g,
            date       : /(?<=\={3}\s)\d{4}\/\d{2}\/\d{2}(?=\s\={20})/g,
            graffiti   : /(?<=\~\n).+/g,
        }    
    
    
    }
}
