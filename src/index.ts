/*----------------------------------
- TYPES
----------------------------------*/
export type TMatchedKeyword = {
    keyword: string,
    score: number,
    position: number
}

export type TMatchedKeywords = {
    keywords: TMatchedKeyword[],
    score: number,
    minAcceptableScore: number,
}

/*----------------------------------
- UTILS
----------------------------------*/

const stringToKeywords = (str: string) => str.toLowerCase().trim().split(/\s+/g);

/*----------------------------------
- FUNCTION
----------------------------------*/
export default ( keywords: string, stringToSearchIn: string ): TMatchedKeywords => {

    const kwToSearchFor = stringToKeywords( keywords )
    const kwToSearchForCount = kwToSearchFor.length;

    stringToSearchIn = stringToSearchIn.toLowerCase();
    const stringToSearchLength = stringToSearchIn.length;

    let score = 0;
    const maxScore = Math.pow(kwToSearchForCount, 2);
    const minAcceptableScore = Math.round(kwToSearchForCount / maxScore * 100);
    const matchedKeywords: TMatchedKeyword[] = []

    // Compute relevancy score
    // We start by searching the whole full string, all the keywords in the right order
    // If it matches, the score will be 100%
    // Then, we search for partial 
    for (let searchSize = kwToSearchForCount; searchSize > 0; searchSize--) {
        
        let groupMatched = false;
        for (let startPos = 0; startPos <= kwToSearchForCount - searchSize; startPos++) {
        
            const endPos = startPos + searchSize;
            const searchString = kwToSearchFor.slice( startPos, endPos ).join(' ');
            const foundPos = stringToSearchIn.indexOf( searchString );

            if (foundPos === -1)
                continue;

            const searchRelevancy = Math.max((
                // The larger is the matched string
                // We do ^2 because if a 3 keywords search string is matched with the right order, 
                // t    he result is more relevant than if the 3 keywords are matched independantly of the order
                Math.pow(searchSize, 2)
                - 
                // The nearest is the matched string from the beginning of the search result, 
                (foundPos / stringToSearchLength)
            ), 0);

            groupMatched = true;
            score += searchRelevancy;
            matchedKeywords.push({
                keyword: searchString,
                score: searchRelevancy,
                position: foundPos
            });
        }
        
        if (groupMatched)
            break;
    }

    const scorePc = Math.round(score / maxScore * 100);
    return {
        keywords: matchedKeywords,
        score: scorePc,
        minAcceptableScore,
    }
}