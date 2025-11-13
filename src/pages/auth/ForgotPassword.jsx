import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import './Auth.scss'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement password reset API call
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-page__gradient"></div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-card__header">
              <h1>이메일 전송 완료</h1>
              <p>
                비밀번호 재설정 링크를 {email}로 전송했습니다.
                <br />
                이메일을 확인해주세요.
              </p>
            </div>

            <Link to="/login">
              <Button variant="primary" fullWidth>
                로그인으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-page__gradient"></div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1>비밀번호 찾기</h1>
            <p>가입하신 이메일 주소를 입력해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="이메일"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              재설정 링크 전송
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/login" className="auth-link">
                로그인으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
