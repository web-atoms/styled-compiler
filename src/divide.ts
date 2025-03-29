export function *divide (text: string) {
    const regex = /^(([^\{\n]+\{[\t\x20]*)|([^\n\}]*\}[^\S\n\r]*))$/gm;
    let m;
    let sentOnce = false;
    let lastIndex = 0;
    let lastMatch: string;
    while((m = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const match = m[0];
        if(!sentOnce) {
            // send first text ..
            // send current ..
            sentOnce = true;
            yield text.substring(lastIndex, m.index);
            lastIndex = m.index + match.length;
            lastMatch = match;
            continue;
        }

        if (lastMatch.includes("}")) {
            yield [lastMatch.trim()];
            lastIndex = m.index + match.length;
            lastMatch = match;
            continue;
        }

        yield [lastMatch, text.substring(lastIndex, m.index), match];
        lastIndex = m.index + match.length;
        lastMatch = match;
    }

    if(lastMatch?.includes("}")) {
        yield [lastMatch.trim()];
    }
};