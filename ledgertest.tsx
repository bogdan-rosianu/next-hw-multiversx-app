import {isTransportCreationPossible, getTransport} from "./transport";
import AppElrond from '@elrondnetwork/hw-app-elrond';

export default async function tryLedger(): Promise<string> {

    let isSup = await isTransportCreationPossible();
    console.log(isSup);
    let transport = await getTransport();

    const erdApp = new AppElrond(transport);

    const {address} = await erdApp.getAddress(0, 0);
    return address;
}
