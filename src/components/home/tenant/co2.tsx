"use client";

import mqtt from "mqtt";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import {
  CardContent,
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";

export const Co2 = ({
  nodeID,
  reportedAt,
  currentValue,
  setID,
  userID,
}: {
  nodeID: string;
  reportedAt: string;
  currentValue: number;
  setID: string;
  userID: string;
}) => {
  const [value, setValue] = useState(currentValue);
  const [reportedTime, setReportedTime] = useState(reportedAt);

  useEffect(() => {
    const topic = `yggio/output/v2/${setID}/iotnode/${nodeID}`;
    const client = mqtt.connect(process.env.NEXT_PUBLIC_YGGIO_MQTT_URL!, {
      username: `user-${userID}`,
      password: "super-secret-password",
    });

    // client.on("connect", () => {
    //   // console.log("Connecting to MQTT broker");
    //   client.subscribe(topic, (err) => {
    //     // if (err) {
    //     //   console.error("Failed to subscribe to topic", err);
    //     // } else {
    //     //   console.log(`Subscribed to topic: ${topic}`);
    //     // }
    //   });
    // });

    client.on("message", (topic, message) => {
      const { iotnode } = JSON.parse(message.toString());

      const reportedAt = iotnode.reportedAt;
      const co2 = iotnode.co2;

      setValue(co2);
      setReportedTime(reportedAt);
    });

    return () => {
      // console.log("Disconnecting from MQTT broker");
      client.end();
    };
  }, [nodeID, setID, userID]);

  const formattedReportedTime = formatDistanceToNow(new Date(reportedTime), {
    addSuffix: true,
  });

  return (
    <ErrorBoundary fallback={<div></div>}>
      <Card className="w-80 rounded-2xl">
        <CardContent className="p-8 pt-4 pb-4">
          <div className="flex flex-row items-center gap-8">
            <CloudDrizzleIcon />
            <div className="grid gap-4">
              <div className="text-2xl font-bold tracking-tighter">
                {value} ppm
              </div>

              <div className="text-xs font-light leading-none">
                {formattedReportedTime}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

function CloudDrizzleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6em"
      height="6em"
      viewBox="0 0 40 40"
    >
      <path
        fill="currentColor"
        d="M15.201 30.464a.466.466 0 0 1-.172-.033a151.637 151.637 0 0 1-3.912-.056c-.943-.023-1.818-.044-2.831-.044a6.005 6.005 0 0 1-5.999-5.998c0-2.004.97-3.832 2.611-4.951a9.885 9.885 0 0 1-.202-1.989c0-5.435 4.422-9.858 9.859-9.858a9.88 9.88 0 0 1 8.684 5.186a5.948 5.948 0 0 1 4.279-1.795a6.005 6.005 0 0 1 5.823 7.452a6.002 6.002 0 0 1 4.372 5.775c0 3.308-2.691 6-5.999 6c-1.542 0-5.043.08-8.428.158c-3.417.08-6.644.153-8.085.153m-.646-21.998c-4.923 0-8.928 4.004-8.928 8.927c0 .707.084 1.412.249 2.095a.465.465 0 0 1-.212.507a5.033 5.033 0 0 0-2.447 4.338A5.073 5.073 0 0 0 8.285 29.4c1.021 0 1.903.021 2.854.044c1.105.026 2.304.055 3.93.055a.47.47 0 0 1 .172.033c1.453-.002 4.792-.078 8.022-.152c3.391-.078 6.897-.158 8.45-.158a5.074 5.074 0 0 0 5.068-5.069a5.066 5.066 0 0 0-4.114-4.977a.464.464 0 0 1-.352-.607a5.073 5.073 0 0 0-4.797-6.711a5.036 5.036 0 0 0-4.018 1.981a.463.463 0 0 1-.793-.094a8.949 8.949 0 0 0-8.152-5.279"
      />
      <path
        fill="currentColor"
        d="M17.858 21.514a.15.15 0 0 1 .117.055l.323.348a2.573 2.573 0 0 1-.894.665c-.35.159-.773.238-1.27.238c-.43 0-.82-.075-1.172-.224a2.558 2.558 0 0 1-.9-.628a2.817 2.817 0 0 1-.578-.97a3.634 3.634 0 0 1-.205-1.243c0-.452.072-.867.214-1.244a2.705 2.705 0 0 1 1.529-1.602a3.095 3.095 0 0 1 1.193-.223c.427 0 .804.069 1.131.205c.326.136.613.322.862.556l-.268.373a.215.215 0 0 1-.065.069a.19.19 0 0 1-.107.027c-.05 0-.112-.027-.184-.082a2.239 2.239 0 0 0-.724-.365a2.2 2.2 0 0 0-.649-.082c-.31 0-.593.055-.851.162a1.846 1.846 0 0 0-.663.467c-.185.203-.33.452-.433.745a2.977 2.977 0 0 0-.154.992c0 .374.054.707.161 1c.107.293.254.541.44.743s.404.357.657.463c.253.106.526.159.819.159c.179 0 .34-.01.483-.032a1.9 1.9 0 0 0 .398-.098a1.65 1.65 0 0 0 .339-.169c.105-.069.209-.151.313-.245a.21.21 0 0 1 .138-.06m6.809-1.758c0 .449-.071.861-.214 1.238a2.852 2.852 0 0 1-.603.969a2.692 2.692 0 0 1-.935.631a3.161 3.161 0 0 1-1.208.223c-.441 0-.843-.074-1.206-.223a2.684 2.684 0 0 1-.933-.631a2.827 2.827 0 0 1-.603-.969a3.457 3.457 0 0 1-.214-1.238c0-.45.071-.862.214-1.238c.143-.375.344-.7.603-.971a2.7 2.7 0 0 1 .933-.634a3.107 3.107 0 0 1 1.206-.226c.442 0 .844.075 1.208.226c.363.15.676.363.935.634c.26.272.461.596.603.971c.143.376.214.788.214 1.238m-.834 0c0-.369-.05-.7-.151-.992a2.089 2.089 0 0 0-.427-.743a1.85 1.85 0 0 0-.67-.467a2.277 2.277 0 0 0-.88-.164c-.321 0-.612.055-.875.164a1.853 1.853 0 0 0-.671.467c-.186.202-.329.45-.43.743c-.1.293-.151.623-.151.992c0 .368.051.698.151.99c.101.291.243.538.43.741c.185.203.409.357.671.464c.263.108.554.162.875.162c.323 0 .617-.054.88-.162c.262-.107.485-.262.67-.464c.185-.203.326-.45.427-.741c.102-.292.151-.622.151-.99m3.636 5.374c.047 0 .085.014.113.042a.148.148 0 0 1 .042.107v.264H25.29v-.149a.27.27 0 0 1 .08-.186l1.12-1.125c.093-.095.177-.185.254-.273c.076-.087.141-.174.195-.263c.054-.088.094-.177.124-.267a.937.937 0 0 0 .044-.29a.68.68 0 0 0-.049-.269a.516.516 0 0 0-.332-.306a.79.79 0 0 0-.493.002a.648.648 0 0 0-.344.273a.688.688 0 0 0-.083.21c-.019.057-.046.095-.079.114c-.034.019-.08.024-.141.016l-.227-.04c.023-.159.067-.3.134-.423c.065-.122.149-.225.249-.309c.1-.082.214-.145.342-.189c.129-.043.268-.064.418-.064c.148 0 .286.022.414.065a.903.903 0 0 1 .557.498a.99.99 0 0 1 .08.41c0 .13-.019.252-.058.362a1.43 1.43 0 0 1-.158.318c-.067.102-.144.2-.231.296c-.087.096-.18.193-.277.291l-.923.941c.065-.017.131-.032.198-.042c.066-.011.131-.016.193-.016h1.172z"
      />
    </svg>
  );
}
