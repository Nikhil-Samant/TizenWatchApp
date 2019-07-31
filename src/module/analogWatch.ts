export class AnalogWatch {
    /**
     * Updates the hour/minute/second hands according to the current time
     * @public
     */
    public updateTime() {
        // const datetime = tizen.time.getCurrentDateTime();
        const datetime = new Date();
        const hour = datetime.getHours();
        const minute = datetime.getMinutes();
        const second = datetime.getSeconds();

        // Rotate the hour/minute/second hands
        this.rotateElement('hand-main-hour', (hour + (minute / 60) + (second / 3600)) * 30);
        this.rotateElement('hand-main-minute', (minute + second / 60) * 6);
        this.rotateElement('hand-main-second', second * 6);
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
        // tizen.time.setTimezoneChangeListener(() => {
        //     this.updateTime();
        // });
    }
    /**
     * Rotates element with a specific ID
     * @private
     * @param {string} elementID - ID of the element to be rotated
     * @param {number} angle - angle of rotation
     */
    private rotateElement(elementID: string, angle: number) {
        const element: HTMLElement = document.querySelector('#' + elementID);
        element.style.transform = 'rotate(' + angle + 'deg)';
    }
}
