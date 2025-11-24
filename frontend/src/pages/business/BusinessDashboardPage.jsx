import { useState, useEffect } from "react";
import { businessStatsApi } from "../../api/businessStatsApi";
import BusinessStatsCards from "../../components/business/dashboard/BusinessStatsCards";
import BusinessChartArea from "../../components/business/dashboard/BusinessChartArea";
import BusinessRecentTable from "../../components/business/dashboard/BusinessRecentTable";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await businessStatsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardStats} />;

  return (
    <div className="business-dashboard-page">
      <h1 className="page-title">대시보드</h1>

      <BusinessStatsCards stats={stats} />
      <BusinessChartArea data={stats?.chartData} />

      <div className="recent-activity">
        <h2>최근 활동</h2>
        <BusinessRecentTable bookings={stats?.recentBookings || []} />
      </div>
    </div>
  );
};

export default BusinessDashboardPage;
