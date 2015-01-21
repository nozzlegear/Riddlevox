var Nozzlegear = (function () {
    function Nozzlegear(options) {
        var _this = this;
        this.options = options;
        //#region Utility variables
        this._isStarted = false;
        this._hasBeenShow = false;
        this._isOpen = false;
        this._defaultOptions = {
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
            OnConversion: function (form, controls) {
                return true;
            }
        };
        //#region Template
        this._template = "<div class='Nozzlegear-header'><a class='Nozzlegear-toggle' href='#'><h2 class='Nozzlegear-title'></h2><span class='Nozzlegear-arrow'></span></a></div><div class='Nozzlegear-content'><p class='Nozzlegear-message'></p><form autocomplete='off' class='Nozzlegear-form'><div class='Nozzlegear-form-group Nozzlegear-fname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='First Name' /></div><div class='Nozzlegear-form-group Nozzlegear-lname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Last Name' /></div><div class='Nozzlegear-form-group Nozzlegear-fullname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Full Name' /></div><div class='Nozzlegear-form-group Nozzlegear-email-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Email Address' /></div><p class='Nozzlegear-error Nozzlegear-hide'></p><button class='Nozzlegear-button' type='button'></button></form></div>";
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
        if (this.options.Position === "bottom-left")
            this._form.classList.add("Nozzlegear-bottom-left");
        if (this.options.Position === "bottom-right")
            this._form.classList.add("Nozzlegear-bottom-right");
        //Set the content
        this._form.getElementsByClassName("Nozzlegear-title").item(0).textContent = this.options.Title;
        this._form.getElementsByClassName("Nozzlegear-message").item(0).textContent = this.options.Message;
        this._form.getElementsByClassName("Nozzlegear-button").item(0).textContent = this.options.ButtonText;
        //Configure form options
        this._configureFormOptions(this.options.FormOptions);
        //Wire up click listeners. Lambda syntax preserves 'this'.
        this._form.getElementsByClassName("Nozzlegear-button").item(0).addEventListener("click", function (e) {
            _this._onButtonClick(e);
        }, true);
        this._form.getElementsByClassName("Nozzlegear-toggle").item(0).addEventListener("click", function (e) {
            _this._toggle(e);
        }, true);
        //Append the form to the document
        document.body.appendChild(this._form);
        //Get the error element
        this._errorElement = this._form.querySelector("p.Nozzlegear-error");
    }
    Nozzlegear.prototype.Open = function () {
        //Show form by removing the untoggled class
        this._form.classList.remove("Nozzlegear-untoggled");
        this._form.style.maxHeight = "600px";
        this._isOpen = true;
        this._hasBeenShow = true;
        return this;
    };
    Nozzlegear.prototype.Close = function () {
        //Hide form by adding the untoggled class
        this._form.style.maxHeight = this._form.querySelector(".Nozzlegear-header").offsetHeight + "px";
        this._form.classList.add("Nozzlegear-untoggled");
        this._isOpen = false;
        return this;
    };
    Nozzlegear.prototype.Start = function () {
        var _this = this;
        if (!this._isStarted) {
            this._isStarted = true;
            var peakForm = function () {
                _this._form.classList.remove("Nozzlegear-hide");
                _this._form.style.maxHeight = _this._form.querySelector(".Nozzlegear-header").offsetHeight + "px";
                if (_this.options.OpenDelay < 0) {
                }
                else if (_this.options.OpenDelay === 0) {
                    _this.Open();
                }
                else {
                    //Must use lambda syntax here to preserve 'this' both in the function and in .Show
                    setTimeout(function () {
                        if (!_this._hasBeenShow) {
                            _this.Open();
                        }
                        ;
                    }, _this.options.OpenDelay);
                }
                ;
            };
            if (this.options.InitialDelay === 0) {
                peakForm();
            }
            else {
                setTimeout(peakForm, this.options.InitialDelay);
            }
            ;
        }
        ;
        return this;
    };
    Nozzlegear.prototype.ShowError = function (message) {
        this._errorElement.textContent = message;
        this._errorElement.classList.remove("Nozzlegear-hide");
        return this;
    };
    Nozzlegear.prototype.HideError = function () {
        this._errorElement.textContent = "";
        this._errorElement.classList.add("Nozzlegear-hide");
        return this;
    };
    //#endregion 
    //#endregion
    //#region Utility functions
    Nozzlegear.prototype._checkDefaults = function (options) {
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
    };
    Nozzlegear.prototype._checkFormDefaults = function (options) {
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
    };
    Nozzlegear.prototype._configureFormOptions = function (options) {
        var _this = this;
        var innerForm = this._form.getElementsByTagName("form").item(0);
        //Config functions
        var configureControlName = function (selector, value) {
            var control = _this._form.getElementsByClassName(selector).item(0).childNodes.item(0);
            control.setAttribute("name", value);
        };
        var hideControl = function (name) {
            _this._form.getElementsByClassName(name).item(0).classList.add("Nozzlegear-hide");
        };
        //Set attributes
        if (options && options.ActionUrl)
            innerForm.action = options.ActionUrl;
        if (options && options.Method)
            innerForm.method = options.Method;
        if (options && options.EmailAddressControlName)
            configureControlName("Nozzlegear-email-capture", options.EmailAddressControlName);
        if (options && options.FirstNameControlName)
            configureControlName("Nozzlegear-fname-capture", options.FirstNameControlName);
        if (options && options.LastNameControlName)
            configureControlName("Nozzlegear-lname-capture", options.LastNameControlName);
        if (options && options.FullNameControlName)
            configureControlName("Nozzlegear-fullname-capture", options.FullNameControlName);
        //Show or hide form controls
        if (!options.CaptureEmailAddress)
            hideControl("Nozzlegear-email-capture");
        if (!options.CaptureFirstName)
            hideControl("Nozzlegear-fname-capture");
        if (!options.CaptureLastName)
            hideControl("Nozzlegear-lname-capture");
        if (!options.CaptureFullName)
            hideControl("Nozzlegear-fullname-capture");
    };
    Nozzlegear.prototype._toggle = function (e) {
        e.preventDefault();
        if (!this._isOpen) {
            this.Open();
        }
        else {
            this.Close();
        }
        ;
    };
    Nozzlegear.prototype._onButtonClick = function (e) {
        e.preventDefault();
        //Always hide the error
        this.HideError();
        //Invoke the developer's OnConversion handler
        if (this.options.OnConversion) {
            //Get the form and controls to pass to the developer's handler
            var innerForm = this._form.getElementsByTagName("form").item(0);
            var controls = {
                EmailAddress: this._form.querySelector("div.Nozzlegear-email-capture > input").value,
                FirstName: this._form.querySelector("div.Nozzlegear-fname-capture > input").value,
                LastName: this._form.querySelector("div.Nozzlegear-lname-capture > input").value,
                FullName: this._form.querySelector("div.Nozzlegear-fullname-capture > input").value,
            };
            //Wait for the handler to return true before submitting the form
            if (this.options.OnConversion(innerForm, controls))
                this._form.getElementsByTagName("form").item(0).submit();
        }
        ;
    };
    return Nozzlegear;
})();
//# sourceMappingURL=Nozzlegear.js.map