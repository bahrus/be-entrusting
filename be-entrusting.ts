import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, EntrustingRule} from './types';
import {register} from 'be-hive/register.js';
import {getRemoteProp} from 'be-linked/defaults.js';
import {getRemoteEl} from 'be-linked/getRemoteEl.js';
import {ObserveRule, ObserverOptions} from 'be-observant/types';
import {Observer} from 'be-observant/Observer.js';

export class BeEntrusting extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        } as BEConfig;
    }
    #abortControllers: Array<AbortController>  = [];
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

    handleObserveCalback = (observe: ObserveRule, val: any) => {
        console.log({observe, val});
    }
        

    async hydrate(self: this){
        const {entrustingRules, enhancedElement} = self;
        for(const entrustRule of entrustingRules!){
            const {localProp, remoteProp, remoteType} = entrustRule;
            let localVal: any;
            if(localProp === undefined){
                const {getSignalVal} = await import('be-linked/getSignalVal.js');
                localVal = getSignalVal(enhancedElement);
            }
            const remoteEl = await getRemoteEl(enhancedElement, '/', remoteProp);
            (<any>remoteEl)[remoteProp] = localVal;
            const observeRule: ObserveRule = {
                remoteProp,
                remoteType,
                callback: this.handleObserveCalback,
                skipInit: true,
            };
            const observerOptions: ObserverOptions = {
                abortControllers: this.#abortControllers,
                remoteEl,
            }
            new Observer(self, observeRule, observerOptions);
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
            hydrate: 'entrustingRules'
        }
    },
    superclass: BeEntrusting,
});

register(ifWantsToBe, upgrade, tagName);

