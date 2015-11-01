interface IRiddlevox {
    Open: () => IRiddlevox;
    Close: () => IRiddlevox;
    Start: () => IRiddlevox;
    ShowError: (message: string) => IRiddlevox;
    HideError: () => IRiddlevox;
}

interface IRiddlevoxFormOptions {
    ActionUrl?: string;
    Method?: string;
    FirstNameControlName?: string;
    LastNameControlName?: string;
    FullNameControlName?: string;
    EmailAddressControlName?: string;
    CaptureFirstName: boolean;
    CaptureLastName: boolean;
    CaptureFullName: boolean;
    CaptureEmailAddress: boolean;
}

interface IRiddlevoxCookieData {
    HasConverted: boolean;
    HasInteracted: boolean;
}

interface IRiddlevoxOptions {
    Position: string;
    UniqueId: string;
    ShowPopupIfConverted: boolean;
    AutoOpenIfPreviouslyInteracted: boolean;
    FormOptions: IRiddlevoxFormOptions;
    Title: string;
    Message: string;
    ButtonText: string;
    BackgroundColor: string;
    AutoOpenDelay: number;
    OnConversion: (form: HTMLFormElement, controls: IRiddlevoxControlsToValidate) => boolean;
}

interface IRiddlevoxControlsToValidate {
    EmailAddress: string;
    FirstName: string;
    LastName: string;
    FullName: string;
}

class Riddlevox implements IRiddlevox {
    constructor(private options?: IRiddlevoxOptions) {
        this.options = this._checkDefaults(options);

        //Build template and append to body
        this._form = document.createElement("div");
        this._form.classList.add("Riddlevox-container");
        this._form.classList.add("Riddlevox-hide");
        this._form.classList.add("Riddlevox-untoggled");
        this._form.style.maxHeight = "0px";
        this._form.style.backgroundColor = this.options.BackgroundColor;
        this._form.innerHTML = this._template;

        //Determine position
        if (this.options.Position === "bottom-left") this._form.classList.add("Riddlevox-bottom-left");
        if (this.options.Position === "bottom-right") this._form.classList.add("Riddlevox-bottom-right");

        //Set the content
        this._form.getElementsByClassName("Riddlevox-title").item(0).textContent = this.options.Title;
        this._form.getElementsByClassName("Riddlevox-message").item(0).textContent = this.options.Message;
        this._form.getElementsByClassName("Riddlevox-button").item(0).textContent = this.options.ButtonText;

        //Configure form options
        this._configureFormOptions(this.options.FormOptions);

        //Wire up click listeners. Lambda syntax preserves 'this'.
        (<HTMLElement>this._form.getElementsByClassName("Riddlevox-button").item(0)).addEventListener("click", (e) => { this._onButtonClick(e); }, true);
        (<HTMLElement>this._form.getElementsByClassName("Riddlevox-toggle").item(0)).addEventListener("click", (e) => { this._toggle(e); }, true);

        //Append the form to the document
        document.body.appendChild(this._form);

        //Get the error element
        this._errorElement = <HTMLParagraphElement> this._form.querySelector("p.Riddlevox-error");

        //Acquire cookie data
        this._cookieValue = (() => {
            var output: IRiddlevoxCookieData;
            
            try {
                output = JSON.parse(this._getCookie("Riddlevox-" + this.options.UniqueId + "-form"));
            }
            catch (e) {
                output = {
                    HasConverted: false,
                    HasInteracted: false,
                };
            };

            return output;
        })();
    }

    public Open(): IRiddlevox {
        //Ensure the form itself is shown
        this._form.classList.remove("Riddlevox-hide");
        this._form.classList.remove("Riddlevox-untoggled");
        this._form.style.maxHeight = "600px";
        this._isOpen = true;
        this._hasBeenShow = true;

        return this;
    }

    public Close(): IRiddlevox {
        this._form.style.maxHeight = (<HTMLElement> this._form.querySelector(".Riddlevox-header")).offsetHeight + "px";
        this._form.classList.add("Riddlevox-untoggled");
        this._isOpen = false;

        return this;
    }

    public Start(): IRiddlevox {
        if (!this._isStarted) {
            this._isStarted = true;

            //Only auto show if ShowPopupIfConverted is true or user has not converted
            if (this.options.ShowPopupIfConverted || !this._cookieValue.HasConverted) {
                //Show popup's title tab
                this._form.classList.remove("Riddlevox-hide");
                this._form.style.maxHeight = (<HTMLElement> this._form.querySelector(".Riddlevox-header")).offsetHeight + "px";

                //Only auto open if AutoOpenIfPreviouslySeen is true, user has not open/closed popup or device width indicates mobile
                if ((this.options.AutoOpenIfPreviouslyInteracted || !this._cookieValue.HasInteracted) && this._deviceWidth > 830) {
                    console.log("Auto open?", this.options.AutoOpenIfPreviouslyInteracted);
                    console.log("Has interacted?", this._cookieValue.HasInteracted);
                    //Check if we should automatically open the popup
                    if (this.options.AutoOpenDelay < 0) {
                        //Never open if value is less than 0, instead wait for .Show
                    }
                    else if (this.options.AutoOpenDelay === 0) {
                        this.Open();
                    }
                    else {
                        //Must use lambda syntax here to preserve 'this' both in the function and in .Show
                        setTimeout(() => { if (!this._hasBeenShow) { this.Open(); }; }, this.options.AutoOpenDelay);
                    };
                };
            };
        };

        return this;
    }

    public ShowError(message: string): IRiddlevox {
        this._errorElement.textContent = message;
        this._errorElement.classList.remove("Riddlevox-hide");

        return this;
    }

    public HideError(): IRiddlevox {
        this._errorElement.textContent = "";
        this._errorElement.classList.add("Riddlevox-hide");

        return this;
    }

    //#region Utility variables

    private _isStarted: boolean = false;
    private _hasBeenShow: boolean = false;
    private _isOpen: boolean = false;
    private _errorElement: HTMLParagraphElement;
    private _deviceWidth: number = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    private _cookieValue: IRiddlevoxCookieData;

    private _defaultOptions: IRiddlevoxOptions = {
        Position: "bottom-right",
        UniqueId: "defaultUniqueId4256",
        ShowPopupIfConverted: false,
        AutoOpenIfPreviouslyInteracted: false,
        FormOptions: {
            CaptureEmailAddress: true,
            CaptureFirstName: true,
            CaptureFullName: false,
            CaptureLastName: false,
        },
        Title: "Sign up for our mailing list!",
        Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        ButtonText: "Sign up!",
        BackgroundColor: "#34495e",
        AutoOpenDelay: 5000,
        OnConversion: (form, controls) => {
            return true;
        }
    };

    private _form: HTMLElement;

    //#region Template

    private _template: string = "<div class='Riddlevox-header'><a class='Riddlevox-toggle' href='#'><h2 class='Riddlevox-title'></h2><span class='Riddlevox-arrow'></span></a></div><div class='Riddlevox-content'><p class='Riddlevox-message'></p><form autocomplete='off' class='Riddlevox-form'><div class='Riddlevox-form-group Riddlevox-fname-capture'><input type='text' class='Riddlevox-form-control' placeholder='First Name' /></div><div class='Riddlevox-form-group Riddlevox-lname-capture'><input type='text' class='Riddlevox-form-control' placeholder='Last Name' /></div><div class='Riddlevox-form-group Riddlevox-fullname-capture'><input type='text' class='Riddlevox-form-control' placeholder='Full Name' /></div><div class='Riddlevox-form-group Riddlevox-email-capture'><input type='text' class='Riddlevox-form-control' placeholder='Email Address' /></div><p class='Riddlevox-error Riddlevox-hide'></p><button class='Riddlevox-button' type='button'></button></form></div>";

    //#endregion 

    //#endregion

    //#region Utility functions

    private _propertyExists(property: any, isTypeOf: string): boolean {
        if (property === null || typeof (property) !== isTypeOf) {
            return false;
        } else {
            return true;
        };
    }

    private _checkDefaults(options: IRiddlevoxOptions): IRiddlevoxOptions {
        return {
            Position: this._propertyExists(options && options.Position, "string") ? options.Position : this._defaultOptions.Position,
            UniqueId: this._propertyExists(options && options.UniqueId, "string") ? options.UniqueId : this._defaultOptions.UniqueId,
            ShowPopupIfConverted: this._propertyExists(options && options.ShowPopupIfConverted, "boolean") ? options.ShowPopupIfConverted : this._defaultOptions.ShowPopupIfConverted,
            AutoOpenIfPreviouslyInteracted: this._propertyExists(options && options.AutoOpenIfPreviouslyInteracted, "boolean") ? options.AutoOpenIfPreviouslyInteracted : this._defaultOptions.AutoOpenIfPreviouslyInteracted,
            FormOptions: this._checkFormDefaults(options && options.FormOptions),
            Title: this._propertyExists(options && options.Title, "string") ? options.Title : this._defaultOptions.Title,
            Message: this._propertyExists(options && options.Message, "string") ? options.Message : this._defaultOptions.Message,
            ButtonText: this._propertyExists(options && options.ButtonText, "string") ? options.ButtonText : this._defaultOptions.ButtonText,
            BackgroundColor: this._propertyExists(options && options.BackgroundColor, "string") ? options.BackgroundColor : this._defaultOptions.BackgroundColor,
            OnConversion: this._propertyExists(options && options.OnConversion, "function") ? options.OnConversion : this._defaultOptions.OnConversion,
            AutoOpenDelay: this._propertyExists(options && options.AutoOpenDelay, "number") ? options.AutoOpenDelay : this._defaultOptions.AutoOpenDelay,
        };
    }

    private _checkFormDefaults(options: IRiddlevoxFormOptions): IRiddlevoxFormOptions {
        return {
            ActionUrl: this._propertyExists(options && options.ActionUrl, "string") ? options.ActionUrl : null,
            Method: this._propertyExists(options && options.Method, "string") ? options.Method : null,
            EmailAddressControlName: this._propertyExists(options && options.EmailAddressControlName, "string") ? options.EmailAddressControlName : null,
            FirstNameControlName: this._propertyExists(options && options.FirstNameControlName, "string") ? options.FirstNameControlName : null,
            LastNameControlName: this._propertyExists(options && options.LastNameControlName, "string") ? options.LastNameControlName : null,
            FullNameControlName: this._propertyExists(options && options.FullNameControlName, "string") ? options.FullNameControlName : null,
            CaptureEmailAddress: this._propertyExists(options && options.CaptureEmailAddress, "boolean") ? options.CaptureEmailAddress : this._defaultOptions.FormOptions.CaptureEmailAddress,
            CaptureFirstName: this._propertyExists(options && options.CaptureFirstName, "boolean") ? options.CaptureFirstName : this._defaultOptions.FormOptions.CaptureFirstName,
            CaptureLastName: this._propertyExists(options && options.CaptureLastName, "boolean") ? options.CaptureLastName : this._defaultOptions.FormOptions.CaptureLastName,
            CaptureFullName: this._propertyExists(options && options.CaptureFullName, "boolean") ? options.CaptureFullName : this._defaultOptions.FormOptions.CaptureFullName,
        };
    }

    private _configureFormOptions(options: IRiddlevoxFormOptions) {
        var innerForm = this._form.getElementsByTagName("form").item(0);

        //Config functions
        var configureControlName = (selector: string, value: string) => {
            var control = (<HTMLInputElement> this._form.getElementsByClassName(selector).item(0).childNodes.item(0));
            control.setAttribute("name", value);
        };
        var hideControl = (name: string) => {
            (<HTMLElement> this._form.getElementsByClassName(name).item(0)).classList.add("Riddlevox-hide");
        };

        //Set attributes
        if (options && options.ActionUrl) innerForm.action = options.ActionUrl;
        if (options && options.Method) innerForm.method = options.Method;
        if (options && options.EmailAddressControlName) configureControlName("Riddlevox-email-capture", options.EmailAddressControlName);
        if (options && options.FirstNameControlName) configureControlName("Riddlevox-fname-capture", options.FirstNameControlName);
        if (options && options.LastNameControlName) configureControlName("Riddlevox-lname-capture", options.LastNameControlName);
        if (options && options.FullNameControlName) configureControlName("Riddlevox-fullname-capture", options.FullNameControlName);

        //Show or hide form controls
        if (!options.CaptureEmailAddress) hideControl("Riddlevox-email-capture");
        if (!options.CaptureFirstName) hideControl("Riddlevox-fname-capture");
        if (!options.CaptureLastName) hideControl("Riddlevox-lname-capture");
        if (!options.CaptureFullName) hideControl("Riddlevox-fullname-capture");
    }

    private _getCookie(name: string) {
        if (document.cookie.length > 0) {
            var prefix = document.cookie.indexOf(name + "=");
            if (prefix !== -1) {
                prefix = prefix + name.length + 1;
                var suffix = document.cookie.indexOf(";", prefix);
                if (suffix === -1) suffix = document.cookie.length;

                return decodeURIComponent(document.cookie.substring(prefix, suffix));
            };
        };
        return "";
    }

    private _setCookie(name: string, value: string, expirationInDays?: number) {
        if (value) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expirationInDays);
            document.cookie = name + "=" + encodeURIComponent(value) +
            ((expirationInDays === null) ? "" : ";expires=" + exdate.toUTCString());
        }
        else {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        };
    }

    private _saveCookieData() {
        this._setCookie("Riddlevox-" + this.options.UniqueId + "-form", JSON.stringify(this._cookieValue), 365 * 10);
    }

    private _toggle(e: MouseEvent) {
        e.preventDefault();

        if (!this._isOpen) {
            this.Open();
        }
        else {
            this._cookieValue.HasInteracted = true;
            this._saveCookieData();

            this.Close();
        };
    }

    private _onButtonClick(e: MouseEvent) {
        e.preventDefault();

        //Always hide the error
        this.HideError();

        //Invoke the developer's OnConversion handler
        if (this.options.OnConversion) {
            //Get the form and controls to pass to the developer's handler
            var innerForm = this._form.getElementsByTagName("form").item(0);
            var controls: IRiddlevoxControlsToValidate = {
                EmailAddress: (<HTMLInputElement> this._form.querySelector("div.Riddlevox-email-capture > input")).value,
                FirstName: (<HTMLInputElement> this._form.querySelector("div.Riddlevox-fname-capture > input")).value,
                LastName: (<HTMLInputElement> this._form.querySelector("div.Riddlevox-lname-capture > input")).value,
                FullName: (<HTMLInputElement> this._form.querySelector("div.Riddlevox-fullname-capture > input")).value,
            };

            //Wait for the handler to return true before submitting the form
            if (this.options.OnConversion(innerForm, controls)) {
                this._cookieValue.HasConverted = true;
                this._saveCookieData();

                this._form.getElementsByTagName("form").item(0).submit();
            };
        };
    }

    //#endregion
}