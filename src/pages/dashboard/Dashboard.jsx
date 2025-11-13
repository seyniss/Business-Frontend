import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import './Dashboard.scss'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // Simulated data
        setTimeout(() => {
          setStats({
            totalRooms: 45,
            totalBookings: 128,
            totalRevenue: 45680000,
          })
          setRecentBookings([
            {
              id: 1,
              roomType: '디럭스 룸',
              guestName: '김철수',
              checkIn: '2025-11-15',
              checkOut: '2025-11-17',
              amount: 350000,
              status: 'confirmed',
            },
            {
              id: 2,
              roomType: '오션뷰 스위트',
              guestName: '이영희',
              checkIn: '2025-11-18',
              checkOut: '2025-11-20',
              amount: 580000,
              status: 'pending',
            },
            {
              id: 3,
              roomType: '스탠다드 룸',
              guestName: '박민수',
              checkIn: '2025-11-16',
              checkOut: '2025-11-18',
              amount: 280000,
              status: 'confirmed',
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount)
  }

  const getStatusText = (status) => {
    const statusMap = {
      confirmed: '예약 확정',
      pending: '확인 대기',
      cancelled: '취소됨',
    }
    return statusMap[status] || status
  }

  const getStatusClass = (status) => {
    return `booking-status booking-status--${status}`
  }

  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-loading">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <div>
            <h1>호텔명</h1>
            <p>안녕하세요, {user?.name || '사업자'}님</p>
          </div>
        </div>

        <div className="dashboard__stats">
          <Card className="stat-card">
            <div className="stat-card__icon stat-card__icon--room">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">총 객실</p>
              <h2 className="stat-card__value">{stats.totalRooms}</h2>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-card__icon stat-card__icon--booking">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">총 예약</p>
              <h2 className="stat-card__value">{stats.totalBookings}</h2>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-card__icon stat-card__icon--revenue">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H10.5C10.1022 9 9.72064 9.15804 9.43934 9.43934C9.15804 9.72064 9 10.1022 9 10.5C9 10.8978 9.15804 11.2794 9.43934 11.5607C9.72064 11.842 10.1022 12 10.5 12H13.5C13.8978 12 14.2794 12.158 14.5607 12.4393C14.842 12.7206 15 13.1022 15 13.5C15 13.8978 14.842 14.2794 14.5607 14.5607C14.2794 14.842 13.8978 15 13.5 15H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">총 매출</p>
              <h2 className="stat-card__value">
                {formatCurrency(stats.totalRevenue)}
              </h2>
            </div>
          </Card>
        </div>

        <Card title="최근 예약">
          <div className="bookings-table">
            {recentBookings.length === 0 ? (
              <div className="bookings-empty">
                <p>최근 예약이 없습니다</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>객실 타입</th>
                    <th>투숙객</th>
                    <th>체크인</th>
                    <th>체크아웃</th>
                    <th>금액</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.roomType}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.checkIn}</td>
                      <td>{booking.checkOut}</td>
                      <td>{formatCurrency(booking.amount)}</td>
                      <td>
                        <span className={getStatusClass(booking.status)}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <div className="dashboard__actions">
          <Card className="action-card">
            <h3>매출 통계</h3>
            <p>상세한 매출 분석 및 리포트</p>
            <Link to="/statistics">
              <Button variant="secondary">바로가기</Button>
            </Link>
          </Card>

          <Card className="action-card">
            <h3>리뷰 관리</h3>
            <p>고객 리뷰 확인 및 관리</p>
            <Link to="/reviews">
              <Button variant="secondary">바로가기</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
