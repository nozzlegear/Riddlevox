interface IRiddlevox
{
    Open: () => IRiddlevox;
    Close: () => IRiddlevox;
    Start: () => IRiddlevox;
    Destroy: () => void;
    ShowError: (message: string) => IRiddlevox;
    HideError: () => IRiddlevox;
    ShowThankYouMessage: () => IRiddlevox;
}

interface IRiddlevoxOptions
{
    Position: string;
    Title: string;
    Message: string;
    ButtonText: string;
    BackgroundColor: string;
    ThankYouMessage: string;
    OnConversion: (firstName: string, emailAddress: string, vox: Riddlevox) => void;
}

class Riddlevox implements IRiddlevox
{
    constructor(options?: IRiddlevoxOptions)
    {
        this.Options = this.ConfigureDefaults(options);

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

    //#region Utility variables
    
    private Options: IRiddlevoxOptions;

    private IsStarted = false;

    private IsDestroyed = false;

    private IsOpen = false;

    /**
    Riddlevox's error paragraph.
    */
    private ErrorElement: Element;

    /**
    Riddlevox's form element.
    */
    private Form: HTMLElement;

    /**
    Riddlevox's HTML template.
    */
    private Template: string = "<div class='Riddlevox-header'><a class='Riddlevox-toggle' href='#'><h2 class='Riddlevox-title'></h2><span class='Riddlevox-arrow'></span></a></div><div class='Riddlevox-content'><div class='Riddlevox-unconverted'><p class='Riddlevox-message'></p><form autocomplete='off' class='Riddlevox-form'><div class='Riddlevox-form-group Riddlevox-fname-capture'><input type='text' class='Riddlevox-form-control Riddlevox-fname' placeholder='First Name' /></div><div class='Riddlevox-form-group Riddlevox-email-capture'><input type='text' class='Riddlevox-form-control Riddlevox-email' placeholder='Email Address' /></div><p class='Riddlevox-error Riddlevox-hide'></p><button class='Riddlevox-button' type='button'></button></form></div><div class='Riddlevox-converted Riddlevox-hide'><p class='Riddlevox-thanks'></p></div></div>";

    //#endregion

    //#region Utility functions and listeners

    /**
    Configure default options and merge developer-given options.
    */
    private ConfigureDefaults: (options?: IRiddlevoxOptions) => IRiddlevoxOptions = options =>
    {
        const defaults: IRiddlevoxOptions = {
            Position: "bottom-right",
            Title: "Sign up for our mailing list!",
            Message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ButtonText: "Sign up!",
            ThankYouMessage: "Thank you! Your subscription to our mailing list has been confirmed.",
            BackgroundColor: "#34495e",
            OnConversion: (firstName, emailAddress, vox) => {
                console.log(`Received conversion: ${firstName} ${emailAddress}`);
            }
        };
        
        return {
            ...options as IRiddlevoxOptions, 
            defaults
        }
    }

    /**
    The click handler called when the user submits the form.
    */
    private OnFormSubmit = (e: MouseEvent) =>
    {
        e.preventDefault();

        //Always hide the error
        this.HideError();

        //Invoke the developer's OnConversion handler if it exists
        if (this.Options.OnConversion)
        {
            var name = (<HTMLInputElement>this.Form.querySelector("input.Riddlevox-fname")).value;
            var email = (<HTMLInputElement>this.Form.querySelector("input.Riddlevox-email")).value;

            this.Options.OnConversion(name, email, this);

            return;
        };

        //Otherwise, do nothing and show the thank-you message.
        this.ShowThankYouMessage();
    }

    //#endregion

    //#region Public vox methods

    /**
    Starts Riddlevox by adding its closed tab to the page.
    */
    public Start = () =>
    {
        if (this.IsStarted && !this.IsDestroyed)
        {
            return this;
        };

        if (this.IsDestroyed)
        {
            //Return a new version of the form
            return new Riddlevox(this.Options).Start();
        };

        this.IsStarted = true;
        
        //Show popup's title tab 
        this.Form.classList.remove("Riddlevox-hide");
        this.Form.style.maxHeight = (<HTMLElement>this.Form.querySelector(".Riddlevox-header")).offsetHeight + "px";

        return this;
    };

    /**
    Stops and destroys Riddlevox, completely removing the form from th epage.
    */
    public Destroy = () =>
    {
        this.IsDestroyed = true;

        this.Form.remove();
    };

    /**
    Opens Riddlevox's form. This will automatically start Riddlevox if it hasn't been started.
    */
    public Open = (e?: Event) =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (!this.IsStarted)
        {
            this.Start();
        };

        if (this.IsDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        //Open the form.
        this.Form.classList.remove("Riddlevox-untoggled");
        this.Form.style.maxHeight = "600px";
        this.IsOpen = true;

        return this;
    }

    /**
    Closes Riddlevox's form. 
    */
    public Close = (e?: Event) =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (this.IsDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        this.Form.style.maxHeight = (<HTMLElement>this.Form.querySelector(".Riddlevox-header")).offsetHeight + "px";
        this.Form.classList.add("Riddlevox-untoggled");
        this.IsOpen = false;

        return this;
    }

    /**
    Toggles Riddlevox's form open or close.
    */
    public Toggle = (e?: Event) =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (this.IsDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        if (!this.IsOpen)
        {
            this.Open();

            return;
        }

        this.Close();
    }

    /**
    Displays an error message on Riddlevox's form.
    */
    public ShowError = (message: string) =>
    {
        this.ErrorElement.textContent = message;
        this.ErrorElement.classList.remove("Riddlevox-hide");

        return this;
    }

    /**
    Hides Riddlevox's error message.
    */
    public HideError = () =>
    {
        this.ErrorElement.textContent = "";
        this.ErrorElement.classList.add("Riddlevox-hide");

        return this;
    }

    /**
    Removes Riddlevox's form and displays its thank-you message.
    */
    public ShowThankYouMessage = () =>
    {
        this.Form.querySelector(".Riddlevox-unconverted").classList.add("Riddlevox-hide");
        this.Form.querySelector(".Riddlevox-converted").classList.remove("Riddlevox-hide");

        return this;
    }

    //#endregion
}