interface INozzlegear {
    Open: () => INozzlegear;
    Close: () => INozzlegear;
    Start: () => INozzlegear;
    ShowError: (message: string) => INozzlegear;
    HideError: () => INozzlegear;
}

interface INozzlegearFormOptions {
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

interface INozzlegearOptions {
    Position: string;
    FormOptions: INozzlegearFormOptions;
    Title: string;
    Message: string;
    ButtonText: string;
    BackgroundColor: string;
    InitialDelay: number;
    OpenDelay: number;
    OnConversion: (form: HTMLFormElement, controls: INozzlegearControlsToValidate) => boolean;
}

interface INozzlegearControlsToValidate {
    EmailAddress: string;
    FirstName: string;
    LastName: string;
    FullName: string;
}

class Nozzlegear implements INozzlegear {
    constructor(private options?: INozzlegearOptions) {
        this.options = this._checkDefaults(options);

        //Build template and append to body
        this._form = document.createElement("div");
        this._form.classList.add("Nozzlegear-container");
        this._form.classList.add("Nozzlegear-hide");
        this._form.classList.add("Nozzlegear-untoggled");
        this._form.style.maxHeight = "0px";
        this._form.style.backgroundColor = this.options.BackgroundColor;
        this._form.innerHTML = this._template;

        //Determine position
        if (this.options.Position === "bottom-left") this._form.classList.add("Nozzlegear-bottom-left");
        if (this.options.Position === "bottom-right") this._form.classList.add("Nozzlegear-bottom-right");

        //Set the content
        this._form.getElementsByClassName("Nozzlegear-title").item(0).textContent = this.options.Title;
        this._form.getElementsByClassName("Nozzlegear-message").item(0).textContent = this.options.Message;
        this._form.getElementsByClassName("Nozzlegear-button").item(0).textContent = this.options.ButtonText;

        //Configure form options
        this._configureFormOptions(this.options.FormOptions);

        //Wire up click listeners. Lambda syntax preserves 'this'.
        (<HTMLElement>this._form.getElementsByClassName("Nozzlegear-button").item(0)).addEventListener("click", (e) => { this._onButtonClick(e); }, true);
        (<HTMLElement>this._form.getElementsByClassName("Nozzlegear-toggle").item(0)).addEventListener("click", (e) => { this._toggle(e); }, true);

        //Append the form to the document
        document.body.appendChild(this._form);

        //Get the error element
        this._errorElement =  <HTMLParagraphElement> this._form.querySelector("p.Nozzlegear-error");
    }

    public Open(): INozzlegear {
        //Show form by removing the untoggled class
        this._form.classList.remove("Nozzlegear-untoggled");
        this._form.style.maxHeight = "600px";
        this._isOpen = true;
        this._hasBeenShow = true;

        return this;
    }

    public Close(): INozzlegear {
        //Hide form by adding the untoggled class
        this._form.style.maxHeight = (<HTMLElement> this._form.querySelector(".Nozzlegear-header")).offsetHeight + "px";
        this._form.classList.add("Nozzlegear-untoggled");
        this._isOpen = false;

        return this;
    }

    public Start(): INozzlegear {
        if (!this._isStarted) {
            this._isStarted = true;

            var peakForm = () => {
                this._form.classList.remove("Nozzlegear-hide");
                this._form.style.maxHeight = (<HTMLElement> this._form.querySelector(".Nozzlegear-header")).offsetHeight + "px";

                if (this.options.OpenDelay < 0) {
                    //Never open if value is less than 0, instead wait for .Show
                }
                else if (this.options.OpenDelay === 0) {
                    this.Open();
                }
                else {
                    //Must use lambda syntax here to preserve 'this' both in the function and in .Show
                    setTimeout(() => { if (!this._hasBeenShow) { this.Open(); }; }, this.options.OpenDelay);
                };
            };

            if (this.options.InitialDelay === 0) {
                peakForm();
            }
            else {
                setTimeout(peakForm, this.options.InitialDelay);
            };
        };

        return this;
    }

    public ShowError(message: string): INozzlegear {
        this._errorElement.textContent = message;
        this._errorElement.classList.remove("Nozzlegear-hide");

        return this;
    }

    public HideError(): INozzlegear {
        this._errorElement.textContent = "";
        this._errorElement.classList.add("Nozzlegear-hide");

        return this;
    }

    //#region Utility variables

    private _isStarted: boolean = false;
    private _hasBeenShow: boolean = false;
    private _isOpen: boolean = false;
    private _errorElement: HTMLParagraphElement;

    private _defaultOptions: INozzlegearOptions = {
        Position: "bottom-right",
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
        OpenDelay: 5000,
        InitialDelay: 1000,
        OnConversion: (form, controls) => {
            return true;
        }
    };

    private _form: HTMLElement;

    //#region Template

    private _template: string = "<div class='Nozzlegear-header'><a class='Nozzlegear-toggle' href='#'><h2 class='Nozzlegear-title'></h2><span class='Nozzlegear-arrow'></span></a></div><div class='Nozzlegear-content'><p class='Nozzlegear-message'></p><form autocomplete='off' class='Nozzlegear-form'><div class='Nozzlegear-form-group Nozzlegear-fname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='First Name' /></div><div class='Nozzlegear-form-group Nozzlegear-lname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Last Name' /></div><div class='Nozzlegear-form-group Nozzlegear-fullname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Full Name' /></div><div class='Nozzlegear-form-group Nozzlegear-email-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Email Address' /></div><p class='Nozzlegear-error Nozzlegear-hide'></p><button class='Nozzlegear-button' type='button'></button></form></div>";

    //#endregion 

    //#endregion

    //#region Utility functions

    private _checkDefaults(options: INozzlegearOptions): INozzlegearOptions {
        return {
            Position: options && options.Position || this._defaultOptions.Position,
            FormOptions: this._checkFormDefaults(options && options.FormOptions),
            Title: options && options.Title || this._defaultOptions.Title,
            Message: options && options.Message || this._defaultOptions.Message,
            ButtonText: options && options.ButtonText || this._defaultOptions.ButtonText,
            BackgroundColor: options && options.BackgroundColor || this._defaultOptions.BackgroundColor,
            OnConversion: options && options.OnConversion || this._defaultOptions.OnConversion,
            /* Some js wonkiness means a number of 0 or less will return false. Use a ternary operator instead. */
            InitialDelay: (options && typeof (options.InitialDelay) === "number") ? options.InitialDelay : this._defaultOptions.InitialDelay,
            OpenDelay: (options && typeof (options.OpenDelay) === "number") ? options.InitialDelay : this._defaultOptions.OpenDelay,
        };
    }

    private _checkFormDefaults(options: INozzlegearFormOptions): INozzlegearFormOptions {
        return {
            ActionUrl: options && options.ActionUrl,
            Method: options && options.Method,
            EmailAddressControlName: options && options.EmailAddressControlName,
            FirstNameControlName: options && options.FirstNameControlName,
            LastNameControlName: options && options.LastNameControlName,
            FullNameControlName: options && options.FullNameControlName,
            CaptureEmailAddress: options && options.CaptureEmailAddress || this._defaultOptions.FormOptions.CaptureEmailAddress,
            CaptureFirstName: options && options.CaptureFirstName || this._defaultOptions.FormOptions.CaptureFirstName,
            CaptureLastName: options && options.CaptureLastName || this._defaultOptions.FormOptions.CaptureLastName,
            CaptureFullName: options && options.CaptureFullName || this._defaultOptions.FormOptions.CaptureFullName,
        };
    }

    private _configureFormOptions(options: INozzlegearFormOptions) {
        var innerForm = this._form.getElementsByTagName("form").item(0);

        //Config functions
        var configureControlName = (selector: string, value: string) => {
            var control = (<HTMLInputElement> this._form.getElementsByClassName(selector).item(0).childNodes.item(0));
            control.setAttribute("name", value);
        };
        var hideControl = (name: string) => {
            (<HTMLElement> this._form.getElementsByClassName(name).item(0)).classList.add("Nozzlegear-hide");
        };

        //Set attributes
        if (options && options.ActionUrl) innerForm.action = options.ActionUrl;
        if (options && options.Method) innerForm.method = options.Method;
        if (options && options.EmailAddressControlName) configureControlName("Nozzlegear-email-capture", options.EmailAddressControlName);
        if (options && options.FirstNameControlName) configureControlName("Nozzlegear-fname-capture", options.FirstNameControlName);
        if (options && options.LastNameControlName) configureControlName("Nozzlegear-lname-capture", options.LastNameControlName);
        if (options && options.FullNameControlName) configureControlName("Nozzlegear-fullname-capture", options.FullNameControlName);

        //Show or hide form controls
        if (!options.CaptureEmailAddress) hideControl("Nozzlegear-email-capture");
        if (!options.CaptureFirstName) hideControl("Nozzlegear-fname-capture");
        if (!options.CaptureLastName) hideControl("Nozzlegear-lname-capture");
        if (!options.CaptureFullName) hideControl("Nozzlegear-fullname-capture");
    }

    private _toggle(e: MouseEvent) {
        e.preventDefault();

        if (!this._isOpen) {
            this.Open();
        }
        else {
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
            var controls: INozzlegearControlsToValidate = {
                EmailAddress: (<HTMLInputElement> this._form.querySelector("div.Nozzlegear-email-capture > input")).value,
                FirstName: (<HTMLInputElement> this._form.querySelector("div.Nozzlegear-fname-capture > input")).value,
                LastName: (<HTMLInputElement> this._form.querySelector("div.Nozzlegear-lname-capture > input")).value,
                FullName: (<HTMLInputElement> this._form.querySelector("div.Nozzlegear-fullname-capture > input")).value,
            };

            //Wait for the handler to return true before submitting the form
            if (this.options.OnConversion(innerForm, controls)) this._form.getElementsByTagName("form").item(0).submit();
        };
    }

    //#endregion
}