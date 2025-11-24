import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

const FALLBACK_CHART = {
  labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
  revenue: [2000000, 2500000, 2200000, 2800000, 3000000, 3200000],
  bookings: [45, 58, 52, 67, 72, 78],
};

const BusinessChartArea = ({ data }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 0,
    }).format(value);

  const labels = data?.labels?.length ? data.labels : FALLBACK_CHART.labels;
  const revenues = data?.revenue?.length ? data.revenue : FALLBACK_CHART.revenue;
  const bookings = data?.bookings?.length ? data.bookings : FALLBACK_CHART.bookings;

  const chartData = labels.map((label, index) => ({
    month: label,
    revenue:
      revenues[index] ??
      FALLBACK_CHART.revenue[index % FALLBACK_CHART.revenue.length],
    bookings:
      bookings[index] ??
      FALLBACK_CHART.bookings[index % FALLBACK_CHART.bookings.length],
  }));

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2>매출 추이</h2>
        <p className="chart-subtitle">최근 6개월 매출과 예약 수</p>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `${Math.round(value / 10000)}만`}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value, name) =>
                name === "매출"
                  ? [`${formatCurrency(value)}원`, name]
                  : [`${value}건`, name]
              }
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="매출"
              fill="#7FD8BE"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              name="예약 수"
              stroke="#F97316"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BusinessChartArea;
