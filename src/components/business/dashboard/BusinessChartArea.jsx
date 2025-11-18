const BusinessChartArea = ({ data }) => {
  return (
    <div className="chart-section">
      <h2>매출 추이</h2>
      <div className="chart-placeholder">
        <p>차트 영역 (Chart.js 또는 Recharts 사용)</p>
        <p className="chart-data">
          데이터: {`{"labels":["1월","2월","3월","4월","5월","6월"],"revenue":[2000000,2500000,2200000,2800000,3000000,3200000],"bookings":[45,58,52,67,72,78]}`}
        </p>
      </div>
    </div>
  );
};

export default BusinessChartArea;
