# Nozzlegear
Nozzlegear is an open-source Javascript library that will help you capture more leads with email opt-in forms.

##Usage

**NB: ** This section will be updated with better documentation upon the 1.0 release.**

```
var options = {
    Position: "bottom-right",
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
        RequireEmailAddress: true,
        RequireFirstName: false,
        RequireLastName: false,
        RequireFullName: false,
    },
    OnConversion: function (form, controls) {
        //Called when the user clicks the button. Iterate through .controls to get values.
        console.log("Conversion!");
        
        //Return true to submit the form.
        return true;
    },
    InitialDelay: 0, //Controls when the popup itself will be added to the page.
    OpenDelay: 5000, //Controls when the popup will open. Set to 0 for immediately, -1 for never.
};

//Initialize and start Nozzlegear
var gear = new Nozzlegear(options).Start();

//Manually open and close the popup
gear.Open();
gear.Hide();
```