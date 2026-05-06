import styles from './Layout.module.css'

function FlexWrapper({ children, align = 'center', justify = 'flex-start', wrap = true, className = '' }) {
  return (
    <div
      className={`${styles.flexWrapper} ${className}`.trim()}
      style={{ alignItems: align, justifyContent: justify }}
      data-wrap={wrap}
    >
      {children}
    </div>
  )
}

export default FlexWrapper
