import styles from './Interaction.module.css'

function ActionButton({ children, variant = 'primary', className = '', ...rest }) {
  const variantClass = variant === 'ghost' ? styles.ghost : ''
  return (
    <button className={`${styles.actionButton} ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}

export default ActionButton
