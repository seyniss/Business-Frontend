import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import './Auth.scss'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, error, clearError } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => clearError()
  }, [clearError])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-page__gradient"></div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1>로그인</h1>
            <p>Hotelhub Business 계정으로 로그인하세요</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              fullWidth
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              fullWidth
            />

            <div className="auth-form__options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>로그인 상태 유지</span>
              </label>

              <Link to="/forgot-password" className="auth-link">
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              로그인
            </Button>
          </form>

          <div className="auth-divider">
            <span>또는</span>
          </div>

          <div className="auth-social">
            <button className="auth-social__button auth-social__button--kakao">
              <span>카카오로 계속하기</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>
              아직 계정이 없으신가요?{' '}
              <Link to="/signup" className="auth-link">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
