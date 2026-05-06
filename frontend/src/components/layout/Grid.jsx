import styles from './Layout.module.css'

function Grid({ children, columns = 12, className = '' }) {
  return (
    <div
      className={`${styles.grid} ${className}`.trim()}
      style={{ '--grid-columns': columns }}
    >
      {children}
    </div>
  )
}

export default Grid
