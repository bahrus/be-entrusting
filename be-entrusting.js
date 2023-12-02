import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { getRemoteProp } from 'be-linked/defaults.js';
import { getRemoteEl } from 'be-linked/getRemoteEl.js';
export class BeEntrusting extends BE {
    static get beConfig() {
        return {
            parse: true,
            parseAndCamelize: true,
            isParsedProp: 'isParsed'
        };
    }
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
    async hydrate(self) {
        const { entrustingRules, enhancedElement } = self;
        for (const entrustRule of entrustingRules) {
            const { localProp, remoteProp } = entrustRule;
            let localVal;
            if (localProp === undefined) {
                const { getSignalVal } = await import('be-linked/getSignalVal.js');
                localVal = getSignalVal(enhancedElement);
            }
            const remoteEl = await getRemoteEl(enhancedElement, '/', remoteProp);
            remoteEl[remoteProp] = localVal;
            //new Observer(self, observe, this.#abortControllers);
            //await hydrateObserve(self, observe, this.#abortControllers)
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
