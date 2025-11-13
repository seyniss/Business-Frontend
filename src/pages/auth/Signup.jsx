import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import './Auth.scss'

const Signup = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated, error, clearError } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [agreed, setAgreed] = useState(false)

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
    // Clear field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }

    if (formData.password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다'
    }

    if (!agreed) {
      errors.agreed = '약관에 동의해주세요'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const { confirmPassword, ...userData } = formData
    const result = await register(userData)

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
            <h1>회원가입</h1>
            <p>Hotelhub Business 사업자 계정을 만드세요</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="이름"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              fullWidth
            />

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
              error={formErrors.password}
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              fullWidth
              error={formErrors.confirmPassword}
            />

            <Input
              label="전화번호"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              required
              fullWidth
            />

            <Input
              label="사업장명"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="호텔 이름"
              required
              fullWidth
            />

            <Input
              label="사업자 등록번호"
              type="text"
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              placeholder="000-00-00000"
              required
              fullWidth
            />

            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                <Link to="/terms" className="auth-link">
                  이용약관
                </Link>{' '}
                및{' '}
                <Link to="/privacy" className="auth-link">
                  개인정보처리방침
                </Link>
                에 동의합니다
              </span>
            </label>
            {formErrors.agreed && (
              <span className="auth-error-text">{formErrors.agreed}</span>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              회원가입
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="auth-link">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
