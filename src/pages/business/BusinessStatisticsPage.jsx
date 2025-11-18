import { useState, useEffect } from "react";
import { businessStatsApi } from "../../api/businessStatsApi";

const BusinessStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await businessStatsApi.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>매출 통계</h1>
          <p>호텔 예약 및 매출 통계를 확인합니다</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="card">
          <div className="card__header">
            <h3>오늘</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>예약 수</span>
              <span style={{ fontWeight: "600" }}>{stats.today.bookings}건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>매출</span>
              <span style={{ fontWeight: "600" }}>{formatCurrency(stats.today.revenue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>취소</span>
              <span style={{ fontWeight: "600" }}>{stats.today.cancellations}건</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3>이번 달</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>예약 수</span>
              <span style={{ fontWeight: "600" }}>{stats.thisMonth.bookings}건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>매출</span>
              <span style={{ fontWeight: "600" }}>{formatCurrency(stats.thisMonth.revenue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>취소</span>
              <span style={{ fontWeight: "600" }}>{stats.thisMonth.cancellations}건</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3>올해</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>예약 수</span>
              <span style={{ fontWeight: "600" }}>{stats.thisYear.bookings}건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>매출</span>
              <span style={{ fontWeight: "600" }}>{formatCurrency(stats.thisYear.revenue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>취소</span>
              <span style={{ fontWeight: "600" }}>{stats.thisYear.cancellations}건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessStatisticsPage;
