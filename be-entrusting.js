import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { getRemoteProp } from 'be-linked/defaults.js';
import { getRemoteEl } from 'be-linked/getRemoteEl.js';
import { Observer } from 'be-observant/Observer.js';
import { getLocalSignal } from 'be-linked/defaults.js';
import { setSignalVal } from 'be-linked/setSignalVal.js';
export class BeEntrusting extends BE {
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
    #abortControllers = [];
    async noAttrs(self) {
        const { enhancedElement } = self;
        const entrustingRule = {
            //TODO:  move this evaluation to be-linked -- shared with be-elevating, be-bound
            //Also, support for space delimited itemprop
            remoteProp: getRemoteProp(enhancedElement),
            remoteType: '/'
        };
        return {
            entrustingRules: [entrustingRule]
        };
    }
    async onCamelized(self) {
        const { of, Of } = self;
        let entrustingRules = [];
        if ((of || Of) !== undefined) {
            const { prsOf } = await import('./prsOf.js');
            entrustingRules = prsOf(self);
        }
        return {
            entrustingRules
        };
    }
    #ignoreCallback = false;
    handleObserveCallback = async (observe, val) => {
        if (this.#ignoreCallback) {
            this.#ignoreCallback = false;
            return;
        }
        const { enhancedElement } = this;
        let { localProp } = observe;
        if (enhancedElement[localProp] === val)
            return;
        if (localProp === undefined) {
            const signal = await getLocalSignal(enhancedElement);
            localProp = signal.prop;
            observe.localProp = localProp;
        }
        enhancedElement[localProp] = val;
        console.log({ observe, val });
    };
    async hydrate(self) {
        const { entrustingRules, enhancedElement } = self;
        for (const entrustRule of entrustingRules) {
            const { localProp, remoteProp, remoteType } = entrustRule;
            let localVal;
            if (localProp === undefined) {
                const { getSignalVal } = await import('be-linked/getSignalVal.js');
                localVal = getSignalVal(enhancedElement);
            }
            else {
                localVal = enhancedElement[localProp];
            }
            const remoteEl = await getRemoteEl(enhancedElement, remoteType, remoteProp);
            //this is the problem
            // 
            const observeRule = {
                remoteProp,
                remoteType,
                localProp,
                callback: this.handleObserveCallback,
                skipInit: true,
            };
            const observerOptions = {
                abortControllers: this.#abortControllers,
                remoteEl,
            };
            const observer = new Observer(self, observeRule, observerOptions);
            observer.addEventListener('resolved', e => {
                const { remoteSignal } = observeRule;
                const remoteInstance = remoteSignal?.deref();
                this.#ignoreCallback = true;
                setSignalVal(remoteInstance, localVal);
            });
        }
        //evalObserveRules(self, 'init');
        return {
            resolved: true,
        };
    }
}
const tagName = 'be-entrusting';
const ifWantsToBe = 'entrusting';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
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
