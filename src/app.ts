import { AnalogWatch } from './module/analogWatch';
import { Battery } from './module/battery';
import { DigitalWatch } from './module/digitalWatch';

/**
 * Initiates the application
 * @private
 */
function init() {
    const analogwatch = new AnalogWatch();
    const digitalwatch = new DigitalWatch();
    const battery = new Battery();
    analogwatch.bindEvents();
    digitalwatch.bindEvents();
    battery.ShowBatteryInfo();
    // Update the watch hands every second
    setInterval(() => {
        analogwatch.updateTime();
        digitalwatch.updateDigitalWatch();
    }, 1000);
}

window.onload = () => {
    init();
};
