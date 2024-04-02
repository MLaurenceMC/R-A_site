document.addEventListener('DOMContentLoaded', async () => {
    const generateOTPButton = document.getElementById('generateOTPButton');
    const otpDisplay = document.getElementById('otpDisplay');

    generateOTPButton.addEventListener('click', async () => {
        try {
            // Request Bluetooth device access
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['<service_uuid>'] }],
            });

            // Connect to the device
            const server = await device.gatt.connect();

            // Get the service and characteristic for OTP generation
            const service = await server.getPrimaryService('<service_uuid>');
            const characteristic = await service.getCharacteristic('<characteristic_uuid>');

            // Request OTP generation
            await characteristic.writeValue(new Uint8Array([1]));

            // Listen for OTP response
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const otpArray = new Uint8Array(event.target.value.buffer);
                const otp = String.fromCharCode.apply(null, otpArray);
                otpDisplay.textContent = 'Generated OTP: ' + otp;
            });

            // Start notifications for characteristic value changes
            await characteristic.startNotifications();
        } catch (error) {
            console.error('Error: ', error);
        }
    });
});
