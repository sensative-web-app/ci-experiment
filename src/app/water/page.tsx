import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { getNodes, getSession } from "@/actions";

import { SideNav } from "@/components/nav/side-nav";
import { SensorCard } from "@/components/home/tenant/sensor-card";
import { fetchNodes } from "@/lib/queryHelper";
import { QueryClient } from "@tanstack/react-query";

export default async function Index() {
  const session = await getSession();
  const { accessToken } = session;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["nodes"],
    queryFn: () => fetchNodes(session.accessToken),
  });
  let coldWaterNode;
  let warmWaterNode;

  const allNodes = await getNodes(session.accessToken);

  if (allNodes.length > 0) {
    coldWaterNode = allNodes.find((node: any) => node.name.includes("KV"));
    warmWaterNode = allNodes.find((node: any) => node.name.includes("V.V"));
  }

  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
        <div className="w-full h-full justify-center">
          <div className="flex w-full justify-center gap-24 ">
            <SensorCard
              nodeID={coldWaterNode._id}
              reportedAt={coldWaterNode.reportedAt}
              currentValue={coldWaterNode.currentVolume}
              setID={process.env.NEXT_PUBLIC_SET_ID!}
              // userID={userID!}
              sensorType="cWater"
              sensorUnit="liter"
            />
            {!warmWaterNode ? <></> : (
             <SensorCard
              nodeID={warmWaterNode._id}
              reportedAt={warmWaterNode.reportedAt}
              currentValue={warmWaterNode.currentVolume}
              setID={process.env.NEXT_PUBLIC_SET_ID!}
              // userID={userID!}
              sensorType="wWater"
              sensorUnit="liter"
            />
            )}
          </div>
          <div className="pt-10 w-full justify-center ">
            <ChartWrapper chart="waterChart" accessToken={accessToken!} />
          </div>
        </div>
      </div>
    </SideNav>
  );
}
