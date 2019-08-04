import { AnalogWatch } from './module/analogWatch';
import { Battery } from './module/battery';

/**
 * Initiates the application
 * @private
 */
function init() {
    const watch = new AnalogWatch();
    const battery = new Battery();
    watch.bindEvents();
    battery.ShowBatteryInfo();
    // Update the watch hands every second
    setInterval(() => {
        watch.updateTime();
    }, 1000);
}

window.onload = () => {
    init();
};
