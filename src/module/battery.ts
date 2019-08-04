export class Battery {
    private battery: any;
    private ARR_COLOR = ['red', 'orange', 'yellow', 'green', 'blue'];
    private devMode: boolean = false;

    /**
     * @public
     */
    public ShowBatteryInfo() {
        // @ts-ignore
        this.battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
        if (typeof this.battery === 'undefined') {
            this.devMode = true;
            // @ts-ignore
            navigator.getBattery().then((battery: any) => {
                this.battery = battery;
                // Bind all the battery events
                this.bindEvents();
            });
        } else {
            // Bind all the battery events
            this.bindEvents();
        }
    }

    public bindEvents() {

        const elBattery: HTMLElement = document.querySelector('#component-battery');
        // Adds event listeners to update battery state when the battery is changed.
        if (!this.devMode) {
            this.battery.addEventListener('chargingchange', this.updateBattery());
            this.battery.addEventListener('chargingtimechange', this.updateBattery());
            this.battery.addEventListener('dischargingtimechange', this.updateBattery());
            this.battery.addEventListener('levelchange', this.updateBattery());
        } else {
            this.battery.addEventListener('onchargingchange', this.updateBattery());
            this.battery.addEventListener('onchargingtimechange', this.updateBattery());
            this.battery.addEventListener('ondischargingtimechange', this.updateBattery());
            this.battery.addEventListener('onlevelchange', this.updateBattery());
        }
        // Adds event listeners to change displaying child element when the battery element is clicked.
        elBattery.addEventListener('click', () => {
            this.toggleElement('#battery-icon', '#battery-text');
        });
    }

    private updateBattery() {
        const elBatteryIcon: HTMLElement = document.querySelector('#battery-icon');
        const elBatteryStatus: HTMLElement = document.querySelector('#battery-status');
        const elBatteryText: HTMLElement = document.querySelector('#battery-text');
        const batteryLevel = Math.floor(this.battery.level * 100);
        const batteryGrade = Math.floor(batteryLevel / 20);
        const statusColor = this.ARR_COLOR[batteryGrade];

        elBatteryIcon.style.backgroundImage = 'url(\'./image/color_status/battery_icon_' + statusColor + '.png\')';
        elBatteryStatus.style.backgroundImage = 'url(\'./image/color_status/' + statusColor + '_indicator.png\')';
        elBatteryText.innerHTML = batteryLevel + '%';
    }

    /**
     * Changes display attribute of two elements when occur click event
     * @private
     * @param {object} element1 - The first element id for changing display
     * @param {object} element2 - The second element id for changing display
     */
    private toggleElement(element1: string, element2: string) {
        const el1: HTMLElement = document.querySelector(element1);
        const el2: HTMLElement = document.querySelector(element2);
        if (el1.style.display === 'none') {
            el1.style.display = 'block';
            el2.style.display = 'none';
        } else {
            el1.style.display = 'none';
            el2.style.display = 'block';
        }
    }
}
