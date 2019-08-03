export class Battery {
    private batteryLevel: number;

    public ShowStatus() {
        const battery: any = this.GetBatteryStatus();
        if (typeof battery !== 'undefined') {
            this.batteryLevel = (battery.level !== 0.0) ? (battery.level * 100 ) : 0;
            this.updateCharge(battery);
            this.bindEvents(battery);
        }
    }

    private bindEvents(battery: any) {
        // Add an event listener to update the screen immediately when the device wakes up
        battery.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateCharge(battery);
            }
        });

        battery.addEventListener('chargingchange', () => {
            this.updateCharge(battery);
        });
    }
    private updateCharge(battery: any) {
        const elementID: string = 'battery';
        const element: HTMLElement = document.querySelector('#' + elementID);
        if (battery.charging === true) {
            element.style.backgroundColor = 'gold';
            element.classList.add('animatee');
            console.log(this.batteryLevel + '%');
        } else {
            element.style.backgroundColor = 'green';
            this.updateLevelInfo(battery, element);
        }
    }

    private updateLevelInfo(battery: any, element: HTMLElement) {
        element.classList.remove('Low');
        element.classList.remove('animatee');
        element.classList.add('Color');
        if ((battery.level * 100) <= 15) {
            element.classList.add('battery level-25');
            element.classList.remove('Color');
            element.style.backgroundColor = 'red';
            element.classList.add('Low');
        } else if ((battery.level * 100) <= 25) {
            element.classList.add('battery level-25');
        } else if ((battery.level * 100) <= 50) {
            element.classList.add('battery level-50');
        } else if ((battery.level * 100) <= 75) {
            element.classList.add('battery level-75');
        } else if ((battery.level * 100) <= 100) {
            element.classList.add('battery level-100');
        } else if ((battery.level * 100) === 0) {
            element.classList.add('battery level-0');
        }
    }

    private GetBatteryStatus() {
        // @ts-ignore
        if (typeof tizen !== 'undefined') {
            // @ts-ignore
            tizen.systeminfo.getPropertyValue('BATTERY',
                // @ts-ignore
                (battery) => {
                    console.log('Battery: ' + battery.level);
                    return battery;
                },
                // @ts-ignore
                (error) => {
                    console.log('Error, name: ' + error.name + ', message: ' + error.message);
                });
        }
    }

}
