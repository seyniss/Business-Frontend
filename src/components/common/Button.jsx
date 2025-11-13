import './Button.scss'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full-width' : ''} ${loading ? 'btn--loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading ? <span className="btn__spinner"></span> : children}
    </button>
  )
}

export default Button
