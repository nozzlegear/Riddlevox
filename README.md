# Nozzlegear
Nozzlegear is an open-source Javascript library that will help you capture more leads with email opt-in forms.

##Usage

**NB:** This section will be updated with better documentation upon the 1.0 release.

For proper display on mobile, you must set the meta viewport tag:

```
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

By default, Nozzlegear will not automatically show a popup if the user has converted (subscribed to your list, etc.). Pass in a UniqueId to differentiate between different popups.

``` 
var uniqueId = "mainPageMailingList";
```

Set ShowPopupIfConverted to true to always show the popup, even if the user has already triggered the OnConversion event.

```
var showPopupIfConverted = false;
```

Nozzlegear can be set to automatically open itself using the AutoOpenDelay property. However, if a user manually opens or closes the popup it will not automatically open again. You can override this behavior and force the popup to always automatically open.

**NB**: The popup will NEVER auto open if the user is on a mobile device &mdash; even if this property is true.

```
var autoOpenIfPreviouslyInteracted: false;
```

Configure the rest of the options and then start Nozzlegear:

```
var options = {
    Position: "bottom-right",
    UniqueId: uniqueId,
    ShowPopupIfConverted: showPopupIfConverted,
    AutoOpenIfPreviouslyInteracted: autoOpenIfPreviouslyInteracted,
    Title: "Hello, world!",
    Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ButtonText: "Sign up!",
    BackgroundColor: "#34495e",
    FormOptions: {
        ActionUrl: "",
        Method: "get",
        FirstNameControlName: "FNAME",
        EmailAddressControlName: "LNAME",
        CaptureEmailAddress: true,
        CaptureFirstName: true,
        CaptureFullName: false,
        CaptureLastName: false,
    },
    OnConversion: function (form, controls) {
        //Called when the user clicks the button. 
        console.log("Conversion!");
        
        //Validate control values:
        if(controls.FullName !== "Josh Harms"){
        	gear.ShowError("Your name is not Josh Harms!");
        }
        else if(controls.FirstName !== "Josh"){
        	gear.ShowError("Your first name is not Josh!");
        }
        else if(controls.LastName !== "Harms"){
        	gear.ShowError("Your last name is not Harms!");
        }
        else if(controls.EmailAddress !== "joshua@asyncbuild.com"){
        	gear.ShowError("Your email address is not joshua@asyncbuild.com!");
        }
        else{
	        //Return true to submit the form.
	        return true;
        };
    },
    AutoOpenDelay: 5000, //Controls when the popup will automatically open. Set to 0 for immediately, -1 for never.
};

//Initialize and start Nozzlegear
var gear = new Nozzlegear(options).Start();

//Manually open and close the popup if your settings do not allow it to auto open.
gear.Open();
gear.Hide();
```