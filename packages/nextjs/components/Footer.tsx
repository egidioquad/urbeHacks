import React from "react";
import { Button } from "grommet";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ethToWei } from "~~/utils/convertEth";

export const Footer = () => {
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "StableCoin",
    functionName: "mint",
    args: [ethToWei("100")],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
        <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
          <div>
            <Button
              size="medium"
              primary
              color="#a3e635"
              label="💸 Get USDT"
              onClick={() => writeAsync()}
              style={{ border: "3px solid #9BCF53", textAlign: "center" }}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> by
              </p>
              <div className="flex justify-center items-center gap-1">
                <a
                  className="link"
                  href="https://www.linkedin.com/in/andreeadumitriu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Andri
                </a>
                <a
                  className="link"
                  href="https://www.linkedin.com/in/pietro-jairo-pezzullo-764947237/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pietro
                </a>
                <a
                  className="link"
                  href="https://www.linkedin.com/in/egidio-quadrini-660a9b187/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Egi
                </a>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
