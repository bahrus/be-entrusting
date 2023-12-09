# be-entrusting

## Use case

Derive initial value from server streamed semantic HTML, then entrust its value to some other system of record, like the web component managing the hydrated DOM.

[![NPM version](https://badge.fury.io/js/be-entrusting.png)](http://badge.fury.io/js/be-entrusting)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-entrusting?style=for-the-badge)](https://bundlephobia.com/result?p=be-entrusting)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-entrusting?compression=gzip">
[![Playwright Tests](https://github.com/bahrus/be-entrusting/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-entrusting/actions/workflows/CI.yml)

be-entrusting is a very thin enhancement/wrapper around [be-observant](https://github.com/bahrus/be-observant).  be-entrusting just adds additional support for setting the initial value of what is being observed from the (server-rendered) HTML value.

When HTML is sent to the browser, especially as it pertains to server-streamed web components, there are a number of ways we can pass down "state" associated with each instance:

1.  Encode the state as attributes of the web component.
2.  Send the (JSON) data separately, then hydrate after the streaming is complete.
3.  Use semantic HTML, so that the state can be both encoded and fully decoded from the HTML itself.

Advantages of the third approach:

1.  Styling -- the encoded HTML can already be used to assist in styling, before (or while) the JavaScript hydrates the state.
2.  Performance -- some functionality, such as gathering user input, could begin immediately, without needing to wait for the entire stream to complete.
3.  Provide for JS free, declarative custom elements (WIP).
4.  Enable search engine accuracy via microdata.
5.  Can serialize state from the server to the browser without requiring all properties of the custom element to have an attribute equivalent.

 (Btw, we may choose to stream one fully rendered instance down, and let the power of template instantiation take care of generating all the others).

## Example 1a:

```html
<mood-stone>
    <template shadowrootmode=open>
        <input checked name=isHappy type=checkbox be-entrusting>
    </template>
</mood-stone>
```

What this does:

Sets the mood-stone (host's) isHappy property to true, since the checkbox is checked.

But 9 times out of 10, once this initialization is complete, we will want the host's isHappy property to alter the input element's checked property as it changes.  So be-entrusting does that as well.

## Example 1b: Specify the name of the property to link

```html
<mood-stone>
    <template shadowrootmode=open>
        <input disabled be-entrusting='of disabled property of $0 to is triumphant property of host.'>
    </template>
</mood-stone>
```

What this does:

Sets host's isTriumphant property to true, and observes the host property, updating the disabled property as it changes hereafter.

## Example 1c:  Shorthand notation 

Since the scenario above is likely to repeat for multiple elements, and that's a lot of typing, we want to provide a shorthand way of expressing the same idea.  That is provided below:

```html
<mood-stone>
    <template shadowrootmode=open>
        <input disabled be-entrusting='of disabled to /isSad.'>
    </template>
</mood-stone>
```

"/" is a special character used to signify that we are referring to the host(ish).

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

## Example 1d

```html
<mood-stone>
    <template shadowrootmode=open>
        <div itemscope>
            <link itemprop=isPensive>
            <input disabled be-entrusting='of disabled to $isPensive.'>
        </div>
    </template>
</mood-stone>
```

## Example 1e

```html
<mood-stone>
    <template shadowrootmode=open>
        <div itemscope>
            <link itemprop=isEager be-entrusting href=http://schema.org/True>
        </div>
    </template>
</mood-stone>
```

## Viewing Demos Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Running Tests

```
> npm run test
```

## Using from ESM Module:

```JavaScript
import 'be-entrusting/be-entrusting.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-entrusting';
</script>
```


