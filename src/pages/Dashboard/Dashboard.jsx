import { PiUsersThreeLight } from "react-icons/pi";
import StatCard from "../../components/Dashboard/StatCard";
import { FiUsers } from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GrLineChart } from "react-icons/gr";
import IncomeReport from "../../components/Dashboard/IncomeReport";
import UserGrowth from "../../components/Dashboard/UserGrowth";
import SubscriberGrowth from "../../components/Dashboard/SubscriberGrowth";
import UserTable from "../../components/Dashboard/Table/UserTable";
import { useGetAllUsersQuery } from "../../features/user/userApi";
import { useFetchIncomeReportQuery } from "../../features/dashboardGrapReport/dashboardGraphReport";

const Dashboard = () => {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const { data: income } = useFetchIncomeReportQuery();
  const totalIncome = income?.users[0]?.totalIncome;
  console.log(income);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#8CAB91]"></div>
      </div>
    );
  }
  const totalUsers = users?.length;
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          icon={<PiUsersThreeLight className="text-5xl" />}
          value={totalUsers}
          description="Total User"
        />
        <StatCard
          icon={<FiUsers className="text-5xl" />}
          value="10"
          description="Total Subscribers"
        />
        <StatCard
          icon={<MdOutlineAttachMoney className="text-5xl" />}
          value={totalIncome}
          growthIcon={<GrLineChart className="text-green-600 text-xl" />}
          description="Total Income"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriberGrowth />
        <UserGrowth />
      </div>
      <div className="mt-6">
        <IncomeReport />
      </div>
      
    </div>
  );
};

export default Dashboard;
