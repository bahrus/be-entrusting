# be-entrusting

 [TODO]

## Use case

Derive initial state from server streamed semantic HTML, then entrust its value to some other system of record.

When HTML is sent to the browser, especially as it pertains to server-streamed web components, there are a number of ways we can pass down "state" associated with each instance (btw, we may choose to stream one fully rendered instance down, and let the power of template instantiation take care of the rest):

1.  Encode the state as attributes of the web component.
2.  Send the (JSON) data separately, then hydrate after the streaming is complete.
3.  Use semantic HTML, so that the state can be both encoded and fully decoded from the HTML itself.

Advantages of the third approach:

1.  Styling -- the encoded HTML can already be used to assist in styling, before (or while) the JavaScript hydrates the state.
2.  Performance -- some functionality, such as gathering user input, could begin immediately, without needing to wait for the entire stream to complete.
3.  Provide for JS free, declarative custom elements (WIP).
4.  Enables search engine accuracy via microdata.
5.  Can serialize state from the server to the browser without requiring all properties of the custom element to have an attribute equivalent.

> [!Note]
> This element enhancement would probably be most effective if it could be partly applied in a Cloudflare or Bun or Deno worker and/or a service worker, [w3c willing](https://github.com/whatwg/dom/issues/1222). 

## Example 1a: [TODO]

```html
<mood-stone>
    <template shadowrootmode=open>
        <input disabled be-entrusting='of disabled property of $0 with is happy property of host.'>
    </template>
</mood-stone>
```

What this does:

Sets host's isHappy property to true.

But 9 times out of 10, once this initialization is complete, we will want the host's isHappy property to alter the input element's disabled property as it changes.  So be-entrusting does that as well.

## Example 1b:  Shorthand notation

Since the scenario above is likely to repeat for multiple elements, and that's a lot of typing, we want to provide a shorthand way of expressing the same idea.  That is provided below:

```html
<mood-stone>
    <template shadowrootmode=open>
        <input disabled be-entrusting='of disabled to /isHappy.'>
    </template>
</mood-stone>
```

"/" is a special, optional character used to signify that we are referring to the host(ish).

In the examples below, we will encounter special symbols used in order to keep the statements small:

| Symbol      | Meaning              | Notes                                                                                |
|-------------|----------------------|--------------------------------------------------------------------------------------|
| /propName   |"Hostish"             | Passes initial value to host, then monitor for changes.                              |
| @propName   |Name attribute        | Pass to form element with matching name, list for input events.                      |
| $propName   |Itemprop attribute    | If contenteditible, listens for input events.  Otherwise, uses be-value-added.       |
| #propName   |Id attribute          | Match by id.                                                                         |
| -prop-name  |Marker indicates prop | Passes by attribute marker.                                                          |


"Hostish" means:

1.  First, do a "closest" for an element with attribute itemscope, where the tag name has a dash in it.  Do that search recursively.  
2.  If no match found, use getRootNode().host.

If "to" is part of the property name, it is safest to "escape" such scenarios using "\to".