"use client";

import { useState } from "react";

import ChartWrapper from "./chart-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SensorCard } from "./sensor-card";
import { HumidityGauge } from "./humidity-gauge";
import { useQuery } from "@tanstack/react-query";
import { fetchNodes } from "@/lib/queryHelper";

const componentConfig = [
  { name: "Temperature", component: SensorCard, visible: true },
  { name: "Humidity", component: HumidityGauge, visible: true },
  { name: "Co2", component: SensorCard, visible: true },
  { name: "Electricity chart", component: ChartWrapper, visible: true },
  { name: "Water chart", component: ChartWrapper, visible: true },
];

export const TenantDashboard = ({
  token,

  setID,
}: {
  token: string;

  setID: string;
}) => {
  const [visibleComponents, setVisibleComponents] = useState(
    componentConfig.map((config) => config.visible),
  );

  const { data, isLoading } = useQuery({
    queryKey: ["nodes"],
    queryFn: () => fetchNodes(token),
  });

  // Function to toggle component visibility
  const toggleComponentVisibility = (index: number) => {
    setVisibleComponents((prevState) => {
      const updatedVisibility = [...prevState];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
  };

  const temperatureNodes = data.filter((node: any) =>
    Object.keys(node).some((key) => key.toLowerCase().includes("temperature")),
  );

  const temperatureNode = temperatureNodes[0];
  const humidityNode = data.find((node: any) => node.name.includes("Comfort"));

  const co2Node = data.find((node: any) => node.name.includes("CO2"));
  // console.log(co2Node);

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
      <div className="flex w-full justify-center items-center pt-6 gap-16 ">
        {visibleComponents[0] && !isLoading && temperatureNode &&(
          <SensorCard
            nodeID={temperatureNode._id}
            currentValue={temperatureNode.temperature.toFixed(1)}
            reportedAt={temperatureNode.reportedAt}
            setID={setID!}
            sensorType="temperature"
            sensorUnit="°C"
          />
        )}
         {visibleComponents[1] && !isLoading && humidityNode && (
          <HumidityGauge
            nodeID={humidityNode._id}
            currentValue={humidityNode.relativeHumidity}
            setID={setID!}
            sensorType="relativeHumidity"
          />
        )}
        {visibleComponents[2] && !isLoading && co2Node && (
          <SensorCard
            nodeID={co2Node._id}
            currentValue={co2Node.co2}
            reportedAt={co2Node.reportedAt}
            setID={setID!}
            sensorType="co2"
            sensorUnit="ppm"
          />
        )}


      </div>
      <div className="w-full h-full justify-center items-center">
        {visibleComponents[3] && (
          <div className="w-full h-full justify-center items-center">
            <ChartWrapper
              chart="electricityChart"
              accessToken={token!}
            ></ChartWrapper>
          </div>
        )}
        {visibleComponents[4] && (
          <div className="w-full h-full justify-center items-center my-10">
            <ChartWrapper
              chart="waterChart"
              accessToken={token!}
            ></ChartWrapper>
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
