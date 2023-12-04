import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, EntrustingRule} from './types';
import {register} from 'be-hive/register.js';
import {getRemoteProp} from 'be-linked/defaults.js';
import {getRemoteEl} from 'be-linked/getRemoteEl.js';
import {ObserveRule, ObserverOptions} from 'be-observant/types';
import {Observer} from 'be-observant/Observer.js';
import {getLocalSignal} from 'be-linked/defaults.js';
import {setSignalVal} from 'be-linked/setSignalVal.js';
import { getSignalVal } from 'be-linked/getSignalVal.js';
import { LocalSignal, SignalRefType } from 'be-linked/types';

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

    #ignoreCallback = false;
    handleObserveCallback = async (observe: ObserveRule, val: any)  => {
        if(this.#ignoreCallback){
            this.#ignoreCallback = false;
            return;
        }
        const {enhancedElement} = this;
        let {localProp, localSignal} = observe;
        if(localProp === undefined){
            const signal = await getLocalSignal(enhancedElement);
            localProp = signal.prop;
            localSignal = signal.signal;
            observe.localSignal = signal.signal;
            observe.localProp = localProp;
            setSignalVal(localSignal!, val);
        }else{
            (<any>enhancedElement)[localProp] = val;
        }
        
        
    }
        

    async hydrate(self: this){
        const {entrustingRules, enhancedElement} = self;
        for(const entrustRule of entrustingRules!){
            let {localProp, remoteProp, remoteType} = entrustRule;
            let localVal: any;
            let localSignal: SignalRefType | undefined;
            if(localProp === undefined){
                const signal = await getLocalSignal(enhancedElement);
                localProp = signal.prop;
                localSignal = signal.signal;
                localVal = getSignalVal(signal.signal);
            }else{
                localVal = (<any>enhancedElement)[localProp];
            }
            
            const remoteEl = await getRemoteEl(enhancedElement, remoteType, remoteProp);
            const observeRule: ObserveRule = {
                remoteProp,
                remoteType,
                localProp,
                localSignal,
                callback: this.handleObserveCallback,
                skipInit: true,
            };
            const observerOptions: ObserverOptions = {
                abortControllers: this.#abortControllers,
                remoteEl,
            }
            const observer = new Observer(self, observeRule, observerOptions);
            observer.addEventListener('resolved', e => {
                const {remoteSignal} = observeRule;
                const remoteInstance = remoteSignal?.deref();
                this.#ignoreCallback = true;
                setSignalVal(remoteInstance!, localVal);
            });
        }
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

