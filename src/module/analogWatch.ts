import { WatchDateTime } from './interface/WatchDateTime';
export class AnalogWatch {
    private ARR_MONTH = ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'];
    private ARR_WEEKDAY = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
        'THURSDAY', 'FRIDAY', 'SATURDAY'];
    private updateTimer: any;
    /**
     * Constructor
     */
    private watch: WatchDateTime;
    constructor() {
        this.assignCurrentTime();
        this.initialwatchAngle();
        this.updateDate();
    }

    /**
     * Updates the hour/minute/second hands according to the current time
     * @public
     */
    public updateTime() {
        // Rotate the hour/minute/second hands
        this.calculatePosition();
        this.rotateElement('watch-hour-indicator', this.watch.hrPosition);
        this.rotateElement('watch-min-indicator ', this.watch.minPosition);
        this.rotateElement('watch-second-indicator ', this.watch.secPosition);
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
                this.assignCurrentTime();
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

        this.watch = {
            // @ts-ignore
            datetime: (typeof tizen !== 'undefined') ? tizen.time.getCurrentDateTime() : new Date(),
        };
        this.watch.hour = this.watch.datetime.getHours();
        this.watch.minute = this.watch.datetime.getMinutes();
        this.watch.second = this.watch.datetime.getSeconds();
        this.watch.date = this.watch.datetime.getDate();
        this.watch.month = this.watch.datetime.getMonth();
        this.watch.weekday = this.watch.datetime.getDay();
    }

    /**
     *  Initialize the watch hands according to current time
     */
    private initialwatchAngle() {
        this.watch.hrPosition = (this.watch.hour * 360 / 12) + (this.watch.minute * (360 / 60) / 12);
        this.watch.minPosition = (this.watch.minute * 360 / 60) + (this.watch.second * (360 / 60) / 60);
        this.watch.secPosition = this.watch.second * 360 / 60;
    }

    /**
     *  Calculate the watch hands. Solving the return to zero problem
     */
    private calculatePosition() {
        this.watch.hrPosition = this.watch.hrPosition + (3 / 360);
        this.watch.minPosition = this.watch.minPosition + (6 / 60);
        this.watch.secPosition = this.watch.secPosition + 6;
    }

    /**
     * Updates the current month and date.
     * @private
     * @param {number} prevDate - The date of previous day
     */
    private updateDate(prevDate?: number) {
        const elMonthStr = document.querySelector('#calendar-month');
        const elDateStr = document.querySelector('#calendar-date');
        const elWeekDayStr = document.querySelector('#calendar-weekday');
        let nextInterval;

        /**
         * Check the update condition.
         * If prevDate is "0", it will always update the date.
         */
        if (prevDate !== null) {
            if (prevDate === this.watch.date) {
                /**
                 * If the date was not changed (meaning that something went wrong),
                 * call updateDate again after a second.
                 */
                nextInterval = 1000;
            } else {
                /**
                 * If the day was changed,
                 * call updateDate at the beginning of the next day.
                 */
                nextInterval = this.getChangeDateInterval();
            }
        }

        elMonthStr.innerHTML = this.ARR_MONTH[this.watch.month];
        elWeekDayStr.innerHTML = this.ARR_WEEKDAY[this.watch.weekday];
        elDateStr.innerHTML = this.watch.date.toString();

        // If an updateDate timer already exists, clear the previous timer.
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }

        // Set next timeout for date update.
        this.updateTimer = setTimeout(() => {
            this.updateDate(this.watch.date);
        }, nextInterval);
    }

    private getChangeDateInterval(): number {
        return (23 - this.watch.datetime.getHours()) * 60 * 60 * 1000 +
            (59 - this.watch.datetime.getMinutes()) * 60 * 1000 +
            (59 - this.watch.datetime.getSeconds()) * 1000 +
            (1000 - this.watch.datetime.getMilliseconds()) +
            1;
    }
}
