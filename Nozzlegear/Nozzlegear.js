var NozzlegearPosition;
(function (NozzlegearPosition) {
    NozzlegearPosition[NozzlegearPosition["BottomLeft"] = 0] = "BottomLeft";
    NozzlegearPosition[NozzlegearPosition["Bottom"] = 1] = "Bottom";
    NozzlegearPosition[NozzlegearPosition["BottomRight"] = 2] = "BottomRight";
})(NozzlegearPosition || (NozzlegearPosition = {}));
;
var Nozzlegear = (function () {
    function Nozzlegear(position, options) {
        this.options = options;
        this._onClick = function (e) {
            e.preventDefault();
            // TODO: Invoke the user's OnConversion handler
        };
        //#region Utility variables
        this._isStarted = false;
        this._defaultOptions = {
            Position: 2 /* BottomRight */,
            Title: "Sign up for our mailing list!",
            Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ButtonText: "Sign up!",
            BackgroundColor: "#34495e",
            OpenDelay: 5000,
            InitialDelay: 1000,
            CaptureEmailAddress: true,
            CaptureFirstName: true,
            CaptureFullName: false,
            CaptureLastName: false,
            RequireEmailAddress: true,
            RequireFirstName: false,
            RequireLastName: false,
            RequireFullName: false,
        };
        //#region Template
        this._template = "<div class='Nozzlegear-header'><a class='Nozzlegear-toggle' href='#'><h2 class='Nozzlegear-title'></h2><span class='Nozzlegear-arrow-up'></span><span class='Nozzlegear-arrow-down'></span></a></div><div class='Nozzlegear-content'><p class='Nozzlegear-message'></p><form class='Nozzlegear-form'><div class='Nozzlegear-form-group Nozzlegear-fname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='First Name' /></div><div class='Nozzlegear-form-group Nozzlegear-lname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Last Name' /></div><div class='Nozzlegear-form-group Nozzlegear-fullname-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Full Name' /></div><div class='Nozzlegear-form-group Nozzlegear-email-capture'><input type='text' class='Nozzlegear-form-control' placeholder='Email Address' /></div><button class='Nozzlegear-button' type='button'></button></form></div>";
        this._positionToEnum = function (position) {
            if (!position) {
                position = "bottomright";
            }
            ;
            switch (position.toLowerCase()) {
                default:
                case "bottomright":
                    return 2 /* BottomRight */;
                case "bottom":
                    return 1 /* Bottom */;
                case "bottomleft":
                    return 0 /* BottomLeft */;
            }
            ;
        };
        this.options = this._checkDefaults(position, options);
        //Prepare a unique id to get a reference to the form after appending it to the body
        var uid = "Nozzlegear-" + Math.random();
        //Build template and append to body
        this._form = document.createElement("div");
        this._form.id = uid;
        this._form.classList.add("Nozzlegear-container");
        this._form.classList.add("Nozzlegear-hide");
        this._form.classList.add("Nozzlegear-untoggled");
        this._form.style.backgroundColor = this.options.BackgroundColor;
        this._form.innerHTML = this._template;
        //Determine position
        if (this.options.Position === 0 /* BottomLeft */)
            this._form.classList.add("Nozzlegear-bottom-left");
        if (this.options.Position === 2 /* BottomRight */)
            this._form.classList.add("Nozzlegear-bottom-right");
        //Set the content
        this._form.getElementsByClassName("Nozzlegear-title").item(0).textContent = this.options.Title;
        this._form.getElementsByClassName("Nozzlegear-message").item(0).textContent = this.options.Message;
        this._form.getElementsByClassName("Nozzlegear-button").item(0).textContent = this.options.ButtonText;
        var it = this;
        var hideControl = function (name) {
            it._form.getElementsByClassName(name).item(0).classList.add("Nozzlegear-hide");
        };
        //Show or hide form controls
        if (!this.options.CaptureEmailAddress)
            hideControl("Nozzlegear-email-capture");
        if (!this.options.CaptureFirstName)
            hideControl("Nozzlegear-fname-capture");
        if (!this.options.CaptureLastName)
            hideControl("Nozzlegear-lname-capture");
        if (!this.options.CaptureFullName)
            hideControl("Nozzlegear-fullname-capture");
        //Wire up click listeners
        this._form.getElementsByClassName("Nozzlegear-button").item(0).addEventListener("click", this._onClick);
        this._form.getElementsByClassName("Nozzlegear-toggle").item(0).addEventListener("click", this.Show);
        //Append the form to the document
        document.body.appendChild(this._form);
        //Form reference is lost after appending. Get it back
        this._form = document.getElementById(uid);
    }
    Nozzlegear.prototype.Show = function (e) {
        if (e)
            e.preventDefault();
        this.Hide();
        //Show form by removing the untoggled class
        this._form.classList.remove("Nozzlegear-untoggled");
        return this;
    };
    Nozzlegear.prototype.Hide = function (e) {
        if (e)
            e.preventDefault();
        //Hide form by adding the untoggled class
        this._form.classList.add("Nozzlegear-untoggled");
        return this;
    };
    Nozzlegear.prototype.Start = function () {
        if (!this._isStarted) {
            this._isStarted = true;
            var it = this;
            var peakForm = function () {
                it._form.classList.remove("Nozzlegear-hide");
                if (it.options.OpenDelay < 0) {
                }
                else if (it.options.OpenDelay === 0) {
                    it.Show();
                }
                else {
                    setTimeout(it.Show, it.options.OpenDelay);
                }
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
    //#endregion 
    //#endregion
    //#region Utility functions
    Nozzlegear.prototype._checkDefaults = function (position, options) {
        return {
            Position: this._positionToEnum(position),
            Title: options && options.Title || this._defaultOptions.Title,
            Message: options && options.Message || this._defaultOptions.Message,
            ButtonText: options && options.ButtonText || this._defaultOptions.ButtonText,
            BackgroundColor: options && options.BackgroundColor || this._defaultOptions.BackgroundColor,
            InitialDelay: options && options.InitialDelay || this._defaultOptions.InitialDelay,
            OpenDelay: options && options.OpenDelay || this._defaultOptions.OpenDelay,
            CaptureEmailAddress: options && options.CaptureEmailAddress || this._defaultOptions.CaptureEmailAddress,
            CaptureFirstName: options && options.CaptureFirstName || this._defaultOptions.CaptureFirstName,
            CaptureLastName: options && options.CaptureLastName || this._defaultOptions.CaptureLastName,
            CaptureFullName: options && options.CaptureFullName || this._defaultOptions.CaptureFullName,
            RequireEmailAddress: options && options.RequireEmailAddress || this._defaultOptions.RequireEmailAddress,
            RequireFirstName: options && options.RequireFirstName || this._defaultOptions.RequireFirstName,
            RequireLastName: options && options.RequireLastName || this._defaultOptions.RequireLastName,
            RequireFullName: options && options.RequireFullName || this._defaultOptions.RequireFullName
        };
    };
    return Nozzlegear;
})();
//# sourceMappingURL=Nozzlegear.js.map