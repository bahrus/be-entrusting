# be-entrusting

 [TODO]

## Use case

Derive initial state from server streamed HTML.

When HTML is sent to the browser, especially as it pertains to server-streamed web components, there are a number of ways we can pass down "state" associated with each instance (btw, we may choose to stream one fully rendered instance down, and let the power of template instantiation take care of the rest):

1.  Encode the state as attributes of the web component.
2.  Send the (JSON) data separately, then hydrate after the streaming is complete.
3.  User semantic HTML, so that the state can be both encode and fully decoded from the HTML itself.

Advantages of the third approach:

1.  Styling -- the encoded HTML can already be used to assist in styling, before the JavaScript hydrates the state.
2.  Provide for JS free, declarative custom elements (WIP).
3.  Enables search engine accuracy
4.  Can serialize state from the server to the browser without requiring all properties of the custom element to have an attribute equivalent.

> [!Note]
> This element enhancement would probably be most effective if it could be partly applied in a Cloudflare or Bun or Deno worker and/or a service worker, [w3c willing](https://github.com/whatwg/dom/issues/1222). 

## Example 1a: [TODO]

```html
<mood-stone>
    <template shadowrootmode=open>
        <input disabled be-entrusting='disabled property of $0 with is happy property of host.'>
    </template>
</mood-stone>
```

What this does:

Sets host's isHappy property to true.

But 9 times out of 10, once this initialization is complete, we will want the host's isHappy property to alter the input element's disabled property as it changes.  So be-entrusting does that as well.