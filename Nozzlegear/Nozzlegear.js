var Nozzlegear = (function () {
    function Nozzlegear(options) {
        var _this = this;
        this.options = options;
        //#region Utility variables
        this._isStarted = false;
        this._hasBeenShow = false;
        this._isOpen = false;
        this._deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        this._defaultOptions = {
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
        //Acquire cookie data
        this._cookieValue = (function () {
            var output;
            try {
                output = JSON.parse(_this._getCookie("Nozzlegear-" + _this.options.UniqueId + "-form"));
            }
            catch (e) {
                output = {
                    HasConverted: false,
                    HasInteracted: false,
                };
            }
            ;
            return output;
        })();
    }
    Nozzlegear.prototype.Open = function () {
        //Ensure the form itself is shown
        this._form.classList.remove("Nozzlegear-hide");
        this._form.classList.remove("Nozzlegear-untoggled");
        this._form.style.maxHeight = "600px";
        this._isOpen = true;
        this._hasBeenShow = true;
        return this;
    };
    Nozzlegear.prototype.Close = function () {
        this._form.style.maxHeight = this._form.querySelector(".Nozzlegear-header").offsetHeight + "px";
        this._form.classList.add("Nozzlegear-untoggled");
        this._isOpen = false;
        return this;
    };
    Nozzlegear.prototype.Start = function () {
        var _this = this;
        if (!this._isStarted) {
            this._isStarted = true;
            //Only auto show if ShowPopupIfConverted is true or user has not converted
            if (this.options.ShowPopupIfConverted || !this._cookieValue.HasConverted) {
                //Show popup's title tab
                this._form.classList.remove("Nozzlegear-hide");
                this._form.style.maxHeight = this._form.querySelector(".Nozzlegear-header").offsetHeight + "px";
                //Only auto open if AutoOpenIfPreviouslySeen is true, user has not open/closed popup or device width indicates mobile
                if ((this.options.AutoOpenIfPreviouslyInteracted || !this._cookieValue.HasInteracted) && this._deviceWidth > 830) {
                    console.log("Auto open?", this.options.AutoOpenIfPreviouslyInteracted);
                    console.log("Has interacted?", this._cookieValue.HasInteracted);
                    //Check if we should automatically open the popup
                    if (this.options.AutoOpenDelay < 0) {
                    }
                    else if (this.options.AutoOpenDelay === 0) {
                        this.Open();
                    }
                    else {
                        //Must use lambda syntax here to preserve 'this' both in the function and in .Show
                        setTimeout(function () {
                            if (!_this._hasBeenShow) {
                                _this.Open();
                            }
                            ;
                        }, this.options.AutoOpenDelay);
                    }
                    ;
                }
                ;
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
    Nozzlegear.prototype._propertyExists = function (property, isTypeOf) {
        if (property === null || typeof (property) !== isTypeOf) {
            return false;
        }
        else {
            return true;
        }
        ;
    };
    Nozzlegear.prototype._checkDefaults = function (options) {
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
    };
    Nozzlegear.prototype._checkFormDefaults = function (options) {
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
    Nozzlegear.prototype._getCookie = function (name) {
        if (document.cookie.length > 0) {
            var prefix = document.cookie.indexOf(name + "=");
            if (prefix !== -1) {
                prefix = prefix + name.length + 1;
                var suffix = document.cookie.indexOf(";", prefix);
                if (suffix === -1)
                    suffix = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(prefix, suffix));
            }
            ;
        }
        ;
        return "";
    };
    Nozzlegear.prototype._setCookie = function (name, value, expirationInDays) {
        if (value) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expirationInDays);
            document.cookie = name + "=" + encodeURIComponent(value) + ((expirationInDays === null) ? "" : ";expires=" + exdate.toUTCString());
        }
        else {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }
        ;
    };
    Nozzlegear.prototype._saveCookieData = function () {
        this._setCookie("Nozzlegear-" + this.options.UniqueId + "-form", JSON.stringify(this._cookieValue), 365 * 10);
    };
    Nozzlegear.prototype._toggle = function (e) {
        e.preventDefault();
        if (!this._isOpen) {
            this.Open();
        }
        else {
            this._cookieValue.HasInteracted = true;
            this._saveCookieData();
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
            if (this.options.OnConversion(innerForm, controls)) {
                this._cookieValue.HasConverted = true;
                this._saveCookieData();
                this._form.getElementsByTagName("form").item(0).submit();
            }
            ;
        }
        ;
    };
    return Nozzlegear;
})();
//# sourceMappingURL=Nozzlegear.js.map