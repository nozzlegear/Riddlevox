export interface IRiddlevox
{
    open: () => IRiddlevox;
    close: () => IRiddlevox;
    start: () => IRiddlevox;
    destroy: () => void;
    showError: (message: string) => IRiddlevox;
    hideError: () => IRiddlevox;
    showThankYouMessage: () => IRiddlevox;
}

export interface IRiddlevoxOptions
{
    position: string;
    title: string;
    message: string;
    buttonText: string;
    backgroundColor: string;
    thankYouMessage: string;
    onConversion: (firstName: string, emailAddress: string, vox: Riddlevox) => void;
}

class Riddlevox implements IRiddlevox
{
    constructor(options?: IRiddlevoxOptions) {
        this.options = this.configureDefaults(options);

        //Build template and append to body
        this.form = document.createElement("div");
        this.form.classList.add("Riddlevox-container");
        this.form.classList.add("Riddlevox-hide");
        this.form.classList.add("Riddlevox-untoggled");
        this.form.style.maxHeight = "0px";
        this.form.style.backgroundColor = this.options.backgroundColor;
        this.form.innerHTML = this.template;

        //Determine position
        this.form.classList.add(this.options.position === "bottom-left" ? "Riddlevox-bottom-left" : "Riddlevox-bottom-right");

        //Set the content
        this.formQuery(".Riddlevox-title").textContent = this.options.title;
        this.formQuery(".Riddlevox-message").textContent = this.options.message;
        this.formQuery(".Riddlevox-button").textContent = this.options.buttonText;
        this.formQuery(".Riddlevox-thanks").textContent = this.options.thankYouMessage;

        //Wire up click listeners. Lambda syntax preserves 'this'.
        this.formQuery(".Riddlevox-button").addEventListener("click", this.onFormSubmit);
        this.formQuery(".Riddlevox-toggle").addEventListener("click", this.toggle); 

        //Save the error element
        this.errorElement = this.formQuery("p.Riddlevox-error");

        //Add the form to the body, hidden until .start or .open are called.
        document.body.appendChild(this.form);
    }
    
    private options: IRiddlevoxOptions;

    private isStarted = false;

    private isDestroyed = false;

    private isOpen = false;

    /**
    Riddlevox's error paragraph.
    */
    private errorElement: Element;

    /**
    Riddlevox's form element.
    */
    private form: HTMLElement;

    /**
    Riddlevox's HTML template.
    */
    private template: string = "<div class='Riddlevox-header'><a class='Riddlevox-toggle' href='#'><h2 class='Riddlevox-title'></h2><span class='Riddlevox-arrow'></span></a></div><div class='Riddlevox-content'><div class='Riddlevox-unconverted'><p class='Riddlevox-message'></p><form autocomplete='off' class='Riddlevox-form'><div class='Riddlevox-form-group Riddlevox-fname-capture'><input type='text' class='Riddlevox-form-control Riddlevox-fname' placeholder='First Name' /></div><div class='Riddlevox-form-group Riddlevox-email-capture'><input type='text' class='Riddlevox-form-control Riddlevox-email' placeholder='Email Address' /></div><p class='Riddlevox-error Riddlevox-hide'></p><button class='Riddlevox-button' type='button'></button></form></div><div class='Riddlevox-converted Riddlevox-hide'><p class='Riddlevox-thanks'></p></div></div>";
    
    /**
     * Queries riddlevox's form.
     */
    private formQuery = <T extends HTMLElement = HTMLElement>(selector: string) => {
        const el = this.form.querySelector(selector);
        
        if (!el) {
            throw new Error("Could not find form element with selector " + selector);
        }
        
        return el as T;
    }

    /**
    Configure default options and merge developer-given options.
    */
    private configureDefaults: (options?: IRiddlevoxOptions) => IRiddlevoxOptions = options =>
    {
        const defaults: IRiddlevoxOptions = {
            position: "bottom-right",
            title: "Sign up for our mailing list!",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            buttonText: "Sign up!",
            thankYouMessage: "Thank you! Your subscription to our mailing list has been confirmed.",
            backgroundColor: "#34495e",
            onConversion: (firstName, emailAddress, _) => {
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
    private onFormSubmit: (e: MouseEvent) => void = e =>
    {
        e.preventDefault();

        //Always hide the error
        this.hideError();

        //Invoke the developer's OnConversion handler if it exists
        if (typeof this.options.onConversion === "function")
        {
            var name = (<HTMLInputElement>this.form.querySelector("input.Riddlevox-fname")).value;
            var email = (<HTMLInputElement>this.form.querySelector("input.Riddlevox-email")).value;

            this.options.onConversion(name, email, this);

            return;
        };

        //Otherwise, do nothing and show the thank-you message.
        this.showThankYouMessage();
    }

    /**
    Starts Riddlevox by adding its closed tab to the page.
    */
    public start: () => Riddlevox = () =>
    {
        if (this.isStarted && !this.isDestroyed)
        {
            return this;
        };

        if (this.isDestroyed)
        {
            //Return a new version of the form
            return new Riddlevox(this.options).start();
        };

        this.isStarted = true;
        
        //Show popup's title tab 
        this.form.classList.remove("Riddlevox-hide");
        this.form.style.maxHeight = (<HTMLElement>this.form.querySelector(".Riddlevox-header")).offsetHeight + "px";

        return this;
    };

    /**
    Stops and destroys Riddlevox, completely removing the form from th epage.
    */
    public destroy: () => void = () =>
    {
        this.isDestroyed = true;

        this.form.remove();
    };

    /**
    Opens Riddlevox's form. This will automatically start Riddlevox if it hasn't been started.
    */
    public open: (e?: Event) => Riddlevox = e =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (!this.isStarted)
        {
            this.start();
        };

        if (this.isDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        //Open the form.
        this.form.classList.remove("Riddlevox-untoggled");
        this.form.style.maxHeight = "600px";
        this.isOpen = true;

        return this;
    }

    /**
    Closes Riddlevox's form. 
    */
    public close: (e?: Event) => Riddlevox = e =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (this.isDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        this.form.style.maxHeight = (<HTMLElement>this.form.querySelector(".Riddlevox-header")).offsetHeight + "px";
        this.form.classList.add("Riddlevox-untoggled");
        this.isOpen = false;

        return this;
    }

    /**
    Toggles Riddlevox's form open or close.
    */
    public toggle: (e?: Event) => void = e =>
    {
        if (e)
        {
            e.preventDefault();
        }

        if (this.isDestroyed)
        {
            throw new Error("Riddlevox has been destroyed. Please create a new instance of Riddlevox.");
        }

        if (!this.isOpen)
        {
            this.open();

            return;
        }

        this.close();
    }

    /**
    Displays an error message on Riddlevox's form.
    */
    public showError: (message: string) => Riddlevox = message =>
    {
        this.errorElement.textContent = message;
        this.errorElement.classList.remove("Riddlevox-hide");

        return this;
    }

    /**
    Hides Riddlevox's error message.
    */
    public hideError: () => Riddlevox = () =>
    {
        this.errorElement.textContent = "";
        this.errorElement.classList.add("Riddlevox-hide");

        return this;
    }

    /**
    Removes Riddlevox's form and displays its thank-you message.
    */
    public showThankYouMessage: () => Riddlevox = () =>
    {
        // Hide the unconverted element and show the converted element
        this.formQuery(".Riddlevox-unconverted").classList.add("Riddlevox-hide");
        this.formQuery(".Riddlevox-converted").classList.remove("Riddlevox-hide");

        return this;
    }
}
