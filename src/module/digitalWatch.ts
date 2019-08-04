import { WatchDateTime } from './interface/WatchDateTime';

export class DigitalWatch {
    private watch: WatchDateTime;
    /**
     * Updates the digital watch according to the current time
     * @public
     */
    public updateDigitalWatch() {
        this.assignCurrentTime();
        const elhourStr = document.querySelector('#digital-hour-indicator');
        const elminStr = document.querySelector('#digital-min-indicator');
        // const elsecondStr = document.querySelector('#digital-second-indicator');
        const elpartStr = document.querySelector('#digital-part-indicator');

        elhourStr.innerHTML = this.watch.hour.toString();
        elminStr.innerHTML = this.watch.minute.toString();
        // elsecondStr.innerHTML = this.watch.second.toString();
        elpartStr.innerHTML = this.watch.part;
    }

    public bindEvents() {
        // Add an event listener to update the screen immediately when the device wakes up
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateDigitalWatch();
            }
        });
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
        this.watch.hour = this.get12hourtime(this.watch.datetime.getHours());
        this.watch.minute = this.pad(this.watch.datetime.getMinutes());
        // this.watch.second = this.pad(this.watch.datetime.getSeconds());
        this.watch.part = this.getPart(this.watch.datetime.getHours());
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

    private get12hourtime(hour: any) {
        return this.pad(hour > 12 ? hour - 12 : hour);
    }

    private getPart(hour: any) {
        return hour > 12 ? 'PM' : 'AM';
    }
}