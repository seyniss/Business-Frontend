import './Input.scss'

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'input--error' : ''}`}
        {...props}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  )
}

export default Input
