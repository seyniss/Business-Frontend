import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.scss'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header__gradient"></div>
      <div className="header__content container">
        <Link to="/" className="header__logo">
          <h1>Hotelhub Business</h1>
        </Link>

        <nav className="header__nav">
          <Link to="/" className="header__nav-link">
            대시보드
          </Link>
          <Link to="/rooms" className="header__nav-link">
            객실 관리
          </Link>
          <Link to="/statistics" className="header__nav-link">
            매출 통계
          </Link>
          <Link to="/reviews" className="header__nav-link">
            리뷰 관리
          </Link>
        </nav>

        <div className="header__user">
          {user && (
            <>
              <div className="header__user-info">
                <div className="header__user-avatar">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="header__user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="header__logout">
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
