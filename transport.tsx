// @ts-ignore
import TransportU2f from '@ledgerhq/hw-transport-u2f';
// @ts-ignore
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// @ts-ignore
import platform from 'platform';

export async function getTransport() {
    let webUSBSupported = await TransportWebUSB.isSupported();
    webUSBSupported =
        webUSBSupported && platform.os.family !== 'Windows' && platform.name !== 'Opera';

    //debugger;
    if (webUSBSupported) {
        return TransportWebUSB.create();
    }

    return TransportU2f.create();
}

export async function isTransportCreationPossible() {

    let webUSBSupported = await TransportWebUSB.isSupported();

    webUSBSupported =

        webUSBSupported && platform.os.family !== 'Windows' && platform.name !== 'Opera';

    const u2fSupported = await TransportU2f.isSupported();

    return webUSBSupported || u2fSupported;

}
