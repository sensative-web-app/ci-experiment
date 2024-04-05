"use client";

import { Temperature } from "./temperature";
import { Co2 } from "./co2";

import { useState } from "react";

import ChartWrapper from "./chart-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const componentConfig = [
  { name: "Temperature", component: Temperature, visible: true },
  { name: "Co2", component: Co2, visible: true },
  { name: "Electricity chart", component: ChartWrapper, visible: true },
];

export const TenantDashboard = ({
  token,
  nodes,
  user,
  set,
}: {
  token: string;
  nodes: any[];
  user: any;
  set: any;
}) => {
  const [visibleComponents, setVisibleComponents] = useState(
    componentConfig.map((config) => config.visible),
  );

  // Function to toggle component visibility
  const toggleComponentVisibility = (index: number) => {
    setVisibleComponents((prevState) => {
      const updatedVisibility = [...prevState];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
  };
  const temperatureNode = nodes.find((node) => node.name.includes("Comfort"));
  const co2Node = nodes.find((node) => node.name.includes("CO2"));

  return (
    <div className="flex flex-col h-full w-full justify-center gap-8">
      <div className="absolute top-20 ml-8 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="justify-end">
              <DashboardIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-16">
            {componentConfig.map((config, index) => (
              <DropdownMenuCheckboxItem
                key={config.name}
                checked={visibleComponents[index]}
                onCheckedChange={() => toggleComponentVisibility(index)}
              >
                {config.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex w-full justify-center mt-10 gap-16 ">
        {visibleComponents[0] && (
          <Temperature
            nodeID={"60a3ab8b007e8f00076009eb"}
            currentValue={temperatureNode.temperature}
            reportedAt={temperatureNode.reportedAt}
            setID={set._id}
            userID={user._id}
          />
        )}
        {visibleComponents[1] && (
          <Co2
            nodeID={"6234b61cd68c97000897fca9"}
            currentValue={co2Node.co2}
            reportedAt={co2Node.reportedAt}
            setID={set._id}
            userID={user._id}
          />
        )}
      </div>
      <div className="w-full h-full justify-center">
        {visibleComponents[2] && (
          <div className="w-full h-full justify-center">
            <ChartWrapper accessToken={token!} />
          </div>
        )}
      </div>
    </div>
  );
};

function DashboardIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M21 13.1c-.1 0-.3.1-.4.2l-1 1 2.1 2.1 1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-1.9 1.8l-6.1 6V23h2.1l6.1-6.1-2.1-2M21 3h-8v6h8V3m-2 4h-4V5h4v2m-6 11.06V11h8v.1c-.76 0-1.43.4-1.81.79L18.07 13H15v3.07l-2 1.99M11 3H3v10h8V3m-2 8H5V5h4v6m2 9.06V15H3v6h8v-.94M9 19H5v-2h4v2z" />
    </svg>
  );
}
