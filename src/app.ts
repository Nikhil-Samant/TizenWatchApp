import { AnalogWatch } from './module/analogWatch';
/**
 * Initiates the application
 * @private
 */
function init() {
    const watch = new AnalogWatch();
    watch.bindEvents();

    // Update the watch hands every second
    setInterval(() => {
        watch.updateTime();
    }, 1000);
}

window.onload = () => {
    init();
};
