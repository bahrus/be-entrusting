import { tryParse } from 'be-enhanced/cpu.js';
import { strType } from 'be-observant/prsOf.js';
//TODO import from be-observant/prsOf
const remoteType = String.raw `(?<remoteType>${strType})`;
const remoteProp = String.raw `(?<remoteProp>[\w\-\+\*\/]+)`;
const reOfEntrustingStatements = [];
export function prsOf(self) {
    const { Of, of } = self;
    const both = [...(Of || []), ...(of || [])];
    const entrustingRules = [];
    for (const ofStatement of both) {
        const test = tryParse(ofStatement, reOfEntrustingStatements);
        if (test === null)
            throw 'PE';
        entrustingRules.push(test);
    }
    return entrustingRules;
}
