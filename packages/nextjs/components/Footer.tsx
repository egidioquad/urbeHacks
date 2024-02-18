import React from "react";
import { Button } from "grommet";
import { HeartIcon } from "@heroicons/react/24/outline";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const Footer = () => {
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "StableCoin",
    functionName: "mint",
    args: [BigInt(100000000000000000000)],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            <div>
              <Button size="large" label="💸 Get USDT" onClick={() => writeAsync()}></Button>
            </div>
          </div>
          {/*           <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />{" "}
           */}{" "}
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> by
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://buidlguidl.com/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="link">Andri Pietro Egi</span>
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
