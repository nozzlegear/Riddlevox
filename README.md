# Riddlevox

Riddlevox is an open-source TypeScript widget that will help you capture more leads with email opt-in forms. This is a rough and untested widget, built in a couple of hours to be used solely for demonstrating the power of Shopify's script tag API. 

**Do not use this widget in production, it has not been extensively tested.**

![Riddlevox](./images/example.gif)

## Installation

You can install this package using [npm](https://npmjs.com/@nozzlegear/riddlevox):

```
npm install @nozzlegear/riddlevox --save
```

##Usage

For proper display on mobile, the target website must have set a meta viewport tag with `width=device-width, initiali-scale=1.0`. This will already be set on Shopify store fronts, unless the store has explicitly installed a goofy, mobile-hostile theme.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Configuring Riddlevox

Riddlevox can be configured with the following options, by passing them in as an object to the Riddlevox constructor:

```js
const options = 
{
    position: "bottom-right",
    title: "Sign up for our mailing list!",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonText: "Sign up!",
    thankYouMessage: "Thank you! Your subscription to our mailing list has been confirmed.",
    backgroundColor: "#34495e",
    // Whether Riddlevox should inject its own CSS style tag onto the page.
    // Default value: false
    injectCss: true,
    onConversion: function (firstName, emailAddress, vox) {
        console.log("Conversion received.", firstName, emailAddress);

        if (!fname || !email)
        {
            vox.showError("You must enter a valid first name and email address.");

            return;
        }

        vox.showThankYouMessage();
    }
}
```

### new Riddlevox() and vox.start()

Before you can use Riddlevox, you must construct a new instance of it while passing in the options. 

```js
import { RiddleVox } from "@nozzlegear/riddlevox";

const vox = new Riddlevox(options);

//Show Riddlevox's unopened tab on the page.
vox.start();
```

At this point, nothing will be displayed even though Riddlevox has been added to the page's DOM. Call `vox.start()` to show the title tab.

```js
//Show Riddlevox's title tab.
vox.start();
```

Clicking on the title tab will open and close Riddlevox's form.

### vox.open() and vox.close()

While the user can click on Riddlevox's title tab to open and close the form, you can also open and close it programatically.

```js
//Open Riddlevox's form
vox.open();

//Close Riddlevox's form
vox.close();
```

### vox.showError() and vox.hideError()

Riddlevox lets you show or hide an error message on its form. It should be used when validating their email details after they've submitted the form.

```js
//Show an error on Riddlevox's form.
vox.showError("Please enter a valid email address.");

//Hide that error
vox.hideError();
```

`vox.hideError` will be called automatically by Riddlevox each time the user submits the form.

### vox.showThankYouMessage()

After the user has submitted their details, assuming it passes your validation, you can show the previously configured thank-you message. This will hide Riddlevox's email capture form and display the thank-you message in place of it.

```js
vox.showThankYouMessage();
```

### vox.options.onConversion()

Configure your `onConversion` handler by setting it in Riddlevox's options. When the user submits Riddlevox's email capture form, your `onConversion` handler will be called and receive the user's first name, their email address and the instance of Riddlevox that owns the form.

This is a great time to validate the information they've provided, show an error message if necessary, or else show the thank-you message.

```js
const options = 
{
    ...
    onConversion: function (firstName, emailAddress, vox) {
        console.log("Conversion received.", firstName, emailAddress);

        if (!fname || !email)
        {
            vox.showError("You must enter a valid first name and email address.");

            return;
        }

        vox.showThankYouMessage();
    },
    ...
}
```

### vox.destroy()

If you want to completely remove Riddlevox from the page, including Riddlevox's title tab, you can use this method. Note that after destroying Riddlevox, you must create and start a new instance to use it again.

```js
vox.destroy();
```

# Learn how to build rock-solid Shopify apps with C# and ASP.NET

Riddlevox was built to showcase the power of Shopify's script tag API, which lets you inject your own, custom scripts and JS libraries onto a Shopify store's website. It's a great way to add dynamic functionality or analytics to a merchant's store front. 

I've created a premium course for building rock-solid Shopify apps with C# and ASP.NET, and one of the chapters deals specifically with using custom JavaScript widgets and libraries to add things like Riddlevox to a Shopify store. It's called [The Shopify Development Handbook](https://nozzlegear.com/shopify-development-handbook), and you can get a free preview with real, production-ready code samples by going to [https://nozzlegear.com/shopify-development-handbook](https://nozzlegear.com/shopify-development-handbook). 
