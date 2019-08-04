interface Clock {
    datetime: Date;
    hour?: number;
    minute?: number;
    second?: number;
    hrPosition?: number;
    minPosition?: number;
    secPosition?: number;
}

interface ClockConfiguration {

}
export class AnalogWatch {
    /**
     * Constructor
     */
    private clock: Clock;
    constructor() {
        this.assignCurrentTime();
        this.initialClockAngle();
    }

    /**
     * Updates the hour/minute/second hands according to the current time
     * @public
     */
    public updateTime() {
        // Rotate the hour/minute/second hands
        this.calculatePosition();
        this.rotateElement('watch-hour-indicator', this.clock.hrPosition);
        this.rotateElement('watch-min-indicator ', this.clock.minPosition);
        this.rotateElement('watch-second-indicator ', this.clock.secPosition);
    }

    /**
     * Sets default event listeners.
     * @public
     */
    public bindEvents() {
        // Add an event listener to update the screen immediately when the device wakes up
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateTime();
            }
        });

        // Add eventListener to update the screen when the time zone is changed
        // @ts-ignore
        if (typeof tizen !== 'undefined') {
            // @ts-ignore
            tizen.time.setTimezoneChangeListener(() => {
                this.updateTime();
            });
        }
    }
    /**
     * Rotates element with a specific ID
     * @private
     * @param {string} elementID - ID of the element to be rotated
     * @param {number} angle - angle of rotation
     */
    private rotateElement(elementID: string, angle: number) {
        const element: HTMLElement = document.querySelector('#' + elementID);
        try {
            element.style.transform = 'rotate(' + angle + 'deg)';
        } catch (error) {
            console.log('error' + error);
        }
    }

    /**
     * Assign current time of the device
     * @private
     */
    private assignCurrentTime() {

        this.clock = {
            // @ts-ignore
            datetime: (typeof tizen !== 'undefined') ? tizen.time.getCurrentDateTime() : new Date(),
        };
        this.clock.hour = this.clock.datetime.getHours();
        this.clock.minute = this.clock.datetime.getMinutes();
        this.clock.second = this.clock.datetime.getSeconds();
    }

    /**
     *  Initialize the Clock hands according to current time
     */
    private initialClockAngle() {
        this.clock.hrPosition = (this.clock.hour * 360 / 12) + (this.clock.minute * (360 / 60) / 12);
        this.clock.minPosition = (this.clock.minute * 360 / 60) + (this.clock.second * (360 / 60) / 60);
        this.clock.secPosition = this.clock.second * 360 / 60;
    }

    /**
     *  Calculate the clock hands. Solving the return to zero problem
     */
    private calculatePosition() {
        this.clock.hrPosition = this.clock.hrPosition + (3 / 360);
        this.clock.minPosition = this.clock.minPosition + (6 / 60);
        this.clock.secPosition = this.clock.secPosition + 6;
    }
}
