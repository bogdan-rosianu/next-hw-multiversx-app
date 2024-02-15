import { useEffect } from "react";
import { tryLedger } from "../ledgertest";

export default function Home() {
  useEffect(() => {
    const ad = async () => {
      console.log("before try ledger");
      let t = await tryLedger();
      console.log(t);
      return t;
    };

    ad().then(() => {
      console.log("bbbb");
    });
  });

  return (
    <p> test </p>
  );
}
