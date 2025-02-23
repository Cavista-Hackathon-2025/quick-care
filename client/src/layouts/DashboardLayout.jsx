import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <div className="">
        <div className="">
          <Outlet />
        </div>
      </div>
    </>
  );
}
