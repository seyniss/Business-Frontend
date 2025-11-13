import { useState } from 'react'
import Card from '../../components/common/Card'
import './Statistics.scss'

const Statistics = () => {
  const [stats] = useState({
    today: {
      bookings: 12,
      revenue: 4560000,
      cancellations: 2,
    },
    thisMonth: {
      bookings: 234,
      revenue: 78920000,
      cancellations: 15,
    },
    thisYear: {
      bookings: 2456,
      revenue: 892340000,
      cancellations: 124,
    },
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  return (
    <div className="statistics">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>매출 통계</h1>
            <p>호텔 예약 및 매출 통계를 확인합니다</p>
          </div>
        </div>

        <div className="stats-grid">
          <Card title="오늘">
            <div className="stat-item">
              <span className="stat-item__label">예약 수</span>
              <span className="stat-item__value">{stats.today.bookings}건</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">매출</span>
              <span className="stat-item__value">
                {formatCurrency(stats.today.revenue)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">취소</span>
              <span className="stat-item__value">{stats.today.cancellations}건</span>
            </div>
          </Card>

          <Card title="이번 달">
            <div className="stat-item">
              <span className="stat-item__label">예약 수</span>
              <span className="stat-item__value">{stats.thisMonth.bookings}건</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">매출</span>
              <span className="stat-item__value">
                {formatCurrency(stats.thisMonth.revenue)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">취소</span>
              <span className="stat-item__value">
                {stats.thisMonth.cancellations}건
              </span>
            </div>
          </Card>

          <Card title="올해">
            <div className="stat-item">
              <span className="stat-item__label">예약 수</span>
              <span className="stat-item__value">{stats.thisYear.bookings}건</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">매출</span>
              <span className="stat-item__value">
                {formatCurrency(stats.thisYear.revenue)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">취소</span>
              <span className="stat-item__value">
                {stats.thisYear.cancellations}건
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Statistics
