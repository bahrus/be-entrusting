import { tryParse } from 'be-enhanced/cpu.js';
import { remoteProp, remoteType } from 'be-observant/prsOf.js';
//TODO import from be-observant/prsOf
const PropertyOf = String.raw `(?<!\\)PropertyOf`;
const localPropTo = String.raw `(?<localProp>[\w\:]+)(?<!\\)To`;
const localPropOf$0To = String.raw `(?<localProp>[\w\:]+)${PropertyOf}\$0To`;
const reOfEntrustingStatements = [
    {
        regExp: new RegExp(String.raw `^${localPropOf$0To}${remoteProp}${PropertyOf}(?<!\\)Host`),
        defaultVals: {
            remoteType: '/'
        },
    },
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
        entrustingRules.push(test);
    }
    return entrustingRules;
}
