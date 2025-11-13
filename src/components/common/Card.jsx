import './Card.scss'

const Card = ({ children, title, className = '', noPadding = false, ...props }) => {
  return (
    <div className={`card ${noPadding ? 'card--no-padding' : ''} ${className}`} {...props}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
    </div>
  )
}

export default Card
