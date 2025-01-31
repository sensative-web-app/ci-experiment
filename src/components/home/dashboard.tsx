import { SessionData } from "@/lib/session";
import { PropertyOwner } from "./property-owner/property-owner";
import { TenantDashboard } from "./tenant/tenant-dashboard";
import { Logout } from "../auth/logout";

export const Dashboard = async ({ session }: { session: SessionData }) => {
  const { accessToken, role } = session;

  console.log(console.log(session.role));

  return (
    <div className="w-full">
      {session.role === "tenant" && (
        <TenantDashboard
          setID={process.env.NEXT_PUBLIC_SET_ID!}
          token={accessToken!}
        />
      )}

      {session.role === "property-owner" && <PropertyOwner session={session} />}

      {(!session.role || session.role === "") && (
        <>
          <Logout />
          <div>No role assigned / you do not belong to any usergroup yet</div>
        </>
      )}
    </div>
  );
};
