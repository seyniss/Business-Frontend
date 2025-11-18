const BusinessStatsCards = ({ stats }) => {
  if (!stats) return null;

  const { hotel } = stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">오늘 예약</p>
          <span className="stat-icon icon-calendar">📅</span>
        </div>
        <p className="stat-value">{hotel.todayBookings || 15}</p>
        <p className="stat-change positive">+12% 전월 대비</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">총 매출</p>
          <span className="stat-icon icon-money">💰</span>
        </div>
        <p className="stat-value">{formatCurrency(hotel.totalRevenue)}원</p>
        <p className="stat-change positive">+8% 전월 대비</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">활성 객실</p>
          <span className="stat-icon icon-hotel">🏨</span>
        </div>
        <p className="stat-value">{hotel.totalRooms}</p>
        <p className="stat-change positive">+2 전월 대비</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">신규 회원</p>
          <span className="stat-icon icon-user">👤</span>
        </div>
        <p className="stat-value">{hotel.newMembers || 8}</p>
        <p className="stat-change positive">+15% 전월 대비</p>
      </div>
    </div>
  );
};

export default BusinessStatsCards;
