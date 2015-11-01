var Riddlevox = (function () {
    function Riddlevox(Options) {
        var _this = this;
        this.Options = Options;
        //#region Utility variables
        this.IsStarted = false;
        this.IsDestroyed = false;
        this.IsOpen = false;
        /**
        Riddlevox's HTML template.
        */
        this.Template = "<div class='Riddlevox-header'><a class='Riddlevox-toggle' href='#'><h2 class='Riddlevox-title'></h2><span class='Riddlevox-arrow'></span></a></div><div class='Riddlevox-content'><div class='Riddlevox-unconverted'><p class='Riddlevox-message'></p><form autocomplete='off' class='Riddlevox-form'><div class='Riddlevox-form-group Riddlevox-fname-capture'><input type='text' class='Riddlevox-form-control Riddlevox-fname' placeholder='First Name' /></div><div class='Riddlevox-form-group Riddlevox-email-capture'><input type='text' class='Riddlevox-form-control Riddlevox-email' placeholder='Email Address' /></div><p class='Riddlevox-error Riddlevox-hide'></p><button class='Riddlevox-button' type='button'></button></form></div><div class='Riddlevox-converted Riddlevox-hide'><p class='Riddlevox-thanks'></p></div></div>";
        /**
        The click handler called when the user submits the form.
        */
        this.OnFormSubmit = function (e) {
            e.preventDefault();
            //Always hide the error
            _this.HideError();
            //Invoke the developer's OnConversion handler if it exists
            if (_this.Options.OnConversion) {
                var name = _this.Form.querySelector("input.Riddlevox-fname").value;
                var email = _this.Form.querySelector("input.Riddlevox-email").value;
                _this.Options.OnConversion(name, email, _this);
                return;
            }
            ;
            //Otherwise, do nothing and show the thank-you message.
            _this.ShowThankYouMessage();
        };
        //#endregion
        //#region Public vox methods
        /**
        Starts Riddlevox by adding its closed tab to the page.
        */
        this.Start = function () {
            if (_this.IsStarted && !_this.IsDestroyed) {
                return _this;
            }
            ;
            if (_this.IsDestroyed) {
                //Return a new version of the form
                return new Riddlevox(_this.Options).Start();
            }
            ;
            _this.IsStarted = true;
            //Show popup's title tab 
            _this.Form.classList.remove("Riddlevox-hide");
            _this.Form.style.maxHeight = _this.Form.querySelector(".Riddlevox-header").offsetHeight + "px";
            return _this;
        };
        /**
        Stops and destroys Riddlevox, completely removing the form from th epage.
        */
        this.Destroy = function () {
            _this.IsDestroyed = true;
            _this.Form.remove();
        };
        /**
        Opens Riddlevox's form. This will automatically start Riddlevox if it hasn't been started.
        */
        this.Open = function (e) {
            if (e) {
                e.preventDefault();
            }
            if (!_this.IsStarted) {
                _this.Start();
            }
            ;
            if (_this.IsDestroyed) {
                throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
            }
            //Open the form.
            _this.Form.classList.remove("Riddlevox-untoggled");
            _this.Form.style.maxHeight = "600px";
            _this.IsOpen = true;
            return _this;
        };
        /**
        Closes Riddlevox's form.
        */
        this.Close = function (e) {
            if (e) {
                e.preventDefault();
            }
            if (_this.IsDestroyed) {
                throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
            }
            _this.Form.style.maxHeight = _this.Form.querySelector(".Riddlevox-header").offsetHeight + "px";
            _this.Form.classList.add("Riddlevox-untoggled");
            _this.IsOpen = false;
            return _this;
        };
        /**
        Toggles Riddlevox's form open or close.
        */
        this.Toggle = function (e) {
            if (e) {
                e.preventDefault();
            }
            if (_this.IsDestroyed) {
                throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
            }
            if (!_this.IsOpen) {
                _this.Open();
                return;
            }
            _this.Close();
        };
        /**
        Displays an error message on Riddlevox's form.
        */
        this.ShowError = function (message) {
            _this.ErrorElement.textContent = message;
            _this.ErrorElement.classList.remove("Riddlevox-hide");
            return _this;
        };
        /**
        Hides Riddlevox's error message.
        */
        this.HideError = function () {
            _this.ErrorElement.textContent = "";
            _this.ErrorElement.classList.add("Riddlevox-hide");
            return _this;
        };
        /**
        Removes Riddlevox's form and displays its thank-you message.
        */
        this.ShowThankYouMessage = function () {
            _this.Form.querySelector(".Riddlevox-unconverted").classList.add("Riddlevox-hide");
            _this.Form.querySelector(".Riddlevox-converted").classList.remove("Riddlevox-hide");
            return _this;
        };
        this.Options = this.ConfigureDefaults(Options);
        //Build template and append to body
        this.Form = document.createElement("div");
        this.Form.classList.add("Riddlevox-container");
        this.Form.classList.add("Riddlevox-hide");
        this.Form.classList.add("Riddlevox-untoggled");
        this.Form.style.maxHeight = "0px";
        this.Form.style.backgroundColor = this.Options.BackgroundColor;
        this.Form.innerHTML = this.Template;
        //Determine position
        this.Form.classList.add(this.Options.Position === "bottom-left" ? "Riddlevox-bottom-left" : "Riddlevox-bottom-right");
        //Set the content
        this.Form.querySelector(".Riddlevox-title").textContent = this.Options.Title;
        this.Form.querySelector(".Riddlevox-message").textContent = this.Options.Message;
        this.Form.querySelector(".Riddlevox-button").textContent = this.Options.ButtonText;
        this.Form.querySelector(".Riddlevox-thanks").textContent = this.Options.ThankYouMessage;
        //Wire up click listeners. Lambda syntax preserves 'this'.
        this.Form.querySelector(".Riddlevox-button").addEventListener("click", this.OnFormSubmit);
        this.Form.querySelector(".Riddlevox-toggle").addEventListener("click", this.Toggle);
        //Save the error element
        this.ErrorElement = this.Form.querySelector("p.Riddlevox-error");
        //Add the form to the body, hidden until .Start or .Open are called.
        document.body.appendChild(this.Form);
    }
    //#endregion
    //#region Utility functions and listeners
    /**
    Configure default options and merge developer-given options.
    */
    Riddlevox.prototype.ConfigureDefaults = function (options) {
        var output = {
            Position: "bottom-right",
            Title: "Sign up for our mailing list!",
            Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ButtonText: "Sign up!",
            ThankYouMessage: "Thank you! Your subscription to our mailing list has been confirmed.",
            BackgroundColor: "#34495e",
            OnConversion: null
        };
        for (var attrName in options) {
            output[attrName] = options[attrName];
        }
        return output;
    };
    return Riddlevox;
})();
//# sourceMappingURL=Riddlevox.js.map