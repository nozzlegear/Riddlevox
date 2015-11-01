# Riddlevox

Riddlevox is an open-source TypeScript widget that will help you capture more leads with email opt-in forms. This is a rough and untested widget, built in a couple of hours to be used solely for demonstrating the power of Shopify's script tag API. 

**Do not use this widget in production, it has not been extensively tested.**

![Riddlevox](https://zippy.gfycat.com/WelloffShadowyDuckling.gif)

##Usage

For proper display on mobile, the target website must have set a meta viewport tag with `width=device-width, initiali-scale=1.0`. This will already be set on Shopify store fronts, unless the store has explicitly installed a goofy, mobile-hostile theme.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Configuring Riddlevox

Riddlevox can be configured with the following options, by passing them in as an object to the Riddlevox constructor:

```js
var options = 
{
    Position: "bottom-right",
    Title: "Sign up for our mailing list!",
    Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ButtonText: "Sign up!",
    ThankYouMessage: "Thank you! Your subscription to our mailing list has been confirmed.",
    BackgroundColor: "#34495e",
    OnConversion: function (firstName, emailAddress, vox) {
        console.log("Conversion received.", firstName, emailAddress);

        if (!fname || !email)
        {
            vox.ShowError("You must enter a valid first name and email address.");

            return;
        }

        vox.ShowThankYouMessage();
    }
}
```

### new Riddlevox() and vox.Start()

Before you can use Riddlevox, you must construct a new instance of it while passing in the options. and then call `Start` to show its unopened tab on the page.

```js
var vox = new Riddlevox(options);

//Show Riddlevox's unopened tab on the page.
vox.Start();
```

At this point, nothing will be displayed even though Riddlevox has been added to the page's DOM. Call `vox.Start()` to show the title tab.

```js
//Show Riddlevox's title tab.
vox.Start();
```

Clicking on the title tab will open and close Riddlevox's form.

### vox.Open() and vox.Close()

While the user can click on Riddlevox's title tab to open and close the form, you can also open and close it programatically.

```js
//Open Riddlevox's form
vox.Open();

//Close Riddlevox's form
vox.Close();
```

### vox.ShowError() and vox.HideError()

Riddlevox lets you show or hide an error message on its form. It should be used when validating their email details after they've submitted the form.

```js
//Show an error on Riddlevox's form.
vox.ShowError("Please enter a valid email address.");

//Hide that error
vox.HideError();
```

`vox.HideError` will be called automatically by Riddlevox each time the user submits the form.

### vox.ShowThankYouMessage()

After the user has submitted their details, assuming it passes your validation, you can show the previously configured thank-you message. This will hide Riddlevox's email capture form and display the thank-you message in place of it.

```js
vox.ShowThankYouMessage();
```

### vox.Options.OnConversion()

Configure your `OnConversion` handler by setting it in Riddlevox's options. When the user submits Riddlevox's email capture form, your `OnConversion` handler will be called and receive the user's first name, their email address and the instance of Riddlevox that owns the form.

This is a great time to validate the information they've provided, show an error message if necessary, or else show the thank-you message.

```js
var options = 
{
    ...
    OnConversion: function (firstName, emailAddress, vox) {
        console.log("Conversion received.", firstName, emailAddress);

        if (!fname || !email)
        {
            vox.ShowError("You must enter a valid first name and email address.");

            return;
        }

        vox.ShowThankYouMessage();
    },
    ...
}
```

### vox.Destroy()

If you want to completely remove Riddlevox from the page, including Riddlevox's title tab, you can use this method. Note that after destroying Riddlevox, you must create and start a new instance to use it again.

```js
vox.Destroy();
```

# Learn how to build rock-solid Shopify apps with C# and ASP.NET

Riddlevox was built to showcase the power of Shopify's script tag API, which lets you inject your own, custom scripts and JS libraries onto a Shopify store's website. It's a great way to add dynamic functionality or analytics to a merchant's store front. 

I've created a premium course for building rock-solid Shopify apps with C# and ASP.NET, and one of the chapters deals specifically with using custom JavaScript widgets and libraries to add things like Riddlevox to a Shopify store. It's called [The Shopify Development Handbook](https://nozzlegear.com/shopify-development-handbook), and you can get a free preview with real, production-ready code samples by going to [https://nozzlegear.com/shopify-development-handbook](https://nozzlegear.com/shopify-development-handbook). 