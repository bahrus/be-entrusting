import { tryParse } from 'be-enhanced/cpu.js';
import { remoteProp, remoteType } from 'be-observant/prsOf.js';
//TODO import from be-observant/prsOf
const localPropTo = String.raw `(?<localProp>[\w\:]+)(?<!\\)To`;
const reOfEntrustingStatements = [
    {
        regExp: new RegExp(String.raw `^${localPropTo}${remoteType}${remoteProp}`),
        defaultVals: {}
    }
];
export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    const entrustingRules = [];
    for (const ofStatement of both) {
        const test = tryParse(ofStatement, reOfEntrustingStatements);
        if (test === null)
            throw 'PE';
        console.log({ test });
        entrustingRules.push(test);
    }
    return entrustingRules;
}
