import styles from './State.module.css'

function StateIndicator({ state, variant = 'dot', className = '' }) {
  const toneClass = styles[state] ?? styles.unknown
  const variantClass = variant === 'bar' ? styles.bar : styles.dot

  return (
    <span
      className={`${styles.stateIndicator} ${toneClass} ${variantClass} ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

export default StateIndicator
