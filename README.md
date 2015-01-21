# Nozzlegear
Nozzlegear is an open-source Javascript library that will help you capture more leads with email opt-in forms.

##TODO

1. Use cookies to determine if the form should be automatically opened or shown at all.

##Usage

**NB:** This section will be updated with better documentation upon the 1.0 release.

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
    InitialDelay: 0, //Controls when the popup itself will be added to the page.
    OpenDelay: 5000, //Controls when the popup will open. Set to 0 for immediately, -1 for never.
};

//Initialize and start Nozzlegear
var gear = new Nozzlegear(options).Start();

//Manually open and close the popup if you set your OpenDelay to -1
gear.Open();
gear.Hide();
```