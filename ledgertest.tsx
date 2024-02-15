import { getTransport, isTransportCreationPossible } from "./hw/transport";
import HwProvider from "./hw/provider";


export async function tryLedger(): Promise<string> {
  let isSup = await isTransportCreationPossible();
  console.log(isSup);
  let transport = await getTransport();

  const erdApp = new HwProvider(transport);

  const { address } = await erdApp.getAddress("44'/508'/0'/0'/0'", true);
  return address;
}

export async function provideESDT(): Promise<any> {

}
