import {EntrustingRule, AP} from './types';
import {ElTypes} from 'be-linked/types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';
import {strType, remoteProp, remoteType} from 'be-observant/prsOf.js';

//TODO import from be-observant/prsOf

const reOfEntrustingStatements: Array<RegExpOrRegExpExt<Partial<EntrustingRule>>> = [

];
export function prsOf(self: AP) : Array<EntrustingRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const entrustingRules: Array<EntrustingRule> = [];
    for(const ofStatement of both){
        const test = tryParse(ofStatement, reOfEntrustingStatements) as EntrustingRule;
        if(test === null) throw 'PE';
        
        entrustingRules.push(test);
    }
    return entrustingRules;
}