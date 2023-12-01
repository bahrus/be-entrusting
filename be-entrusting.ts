import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, EntrustingRule} from './types';
import {register} from 'be-hive/register.js';
import {getRemoteProp} from 'be-linked/defaults.js';

export class BeEntrusting extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        } as BEConfig;
    }

    async noAttrs(self: this): ProPAP {
        const {enhancedElement} = self;
        const entrustingRule: EntrustingRule = {
            //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
            //Also, support for space delimited itemprop
            remoteProp: getRemoteProp(enhancedElement),
            remoteType: '/'
        };
        return {
            entrustingRules: [entrustingRule]
        };
    }

    async onCamelized(self: this) {
        const {of, Of} = self;
        let entrustingRules: Array<EntrustingRule> = [];
        if((of || Of) !== undefined){
            const {prsOf} = await import('./prsOf.js');
            entrustingRules = prsOf(self);
        }
        return {
            entrustingRules
        };
    }

    async hydrate(self: this){
        const {entrustingRules} = self;
        for(const entrustRule of entrustingRules!){
            //new Observer(self, observe, this.#abortControllers);
            //await hydrateObserve(self, observe, this.#abortControllers)
        }
        //evalObserveRules(self, 'init');
        return {
            resolved: true,
        }
    }
}

export interface BeEntrusting extends AllProps{}

const tagName = 'be-entrusting';
const ifWantsToBe = 'entrusting';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        isEnh: true,
        propDefaults:{
            ...propDefaults,
        },
        propInfo:{
            ...propInfo,
        },
        actions:{
            noAttrs: {
                ifAllOf: ['isParsed'],
                ifNoneOf: ['of', 'Of']
            },
            onCamelized: {
                ifAllOf: ['isParsed'],
                ifAtLeastOneOf: ['of', 'Of']
            },
        }
    },
    superclass: BeEntrusting,
});

register(ifWantsToBe, upgrade, tagName);

