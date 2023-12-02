import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {ElTypes, SignalRefType} from 'be-linked/types';
import {ObserveRule} from 'be-observant/types';

export interface EndUserProps extends IBE{
    of?: Array<OfStatement>;
    Of?: Array<OfStatement>;
}

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    entrustingRules?: Array<EntrustingRule>
}

export type OfStatement = string;

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{
    noAttrs(self: this): ProPAP;
    onCamelized(self: this): ProPAP;
    hydrate(self: this): ProPAP;
}

export interface EntrustingRule extends ObserveRule{
    
}

