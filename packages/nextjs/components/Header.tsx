"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "grommet";
import { useAccount } from "wagmi";
import { getAccount } from "wagmi/dist/actions";
import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  /*  {
    label: "Debug",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
  {
    label: "Subgraph",
    href: "/subgraph",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  }, */
  {
    label: "Create",
    href: "/create",
    icon: <StarIcon className="h-4 w-4" />,
  },
  {
    label: "All Campaigns",
    href: "/projects",
    icon: <StarIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-lime-300 shadow-md" : ""
              } hover:bg-lime-300 hover:shadow-md focus:!bg-lime-300 active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const account = useAccount();

  /*   const { data: amount } = useScaffoldContractRead({
    contractName: "Fundraising",
    functionName: "getFundToken",
    args: [account.address],
  }); */

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-lime-400 min-h-0 flex-shrink-0 justify-between z-20  px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-lime-300" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-lime-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.png" />
          </div>
          <div className="flex flex-col">
            <span className="font-lighter leading-tight">42 Care</span>
            {/*             <span className="text-xs">Ethereum dev se ci va</span>
             */}{" "}
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow flex items-center">
        {/* <div>: {amount !== undefined ? String(amount) : "0"}</div> */}
        <div className="mr-4">
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </div>
  );
};
