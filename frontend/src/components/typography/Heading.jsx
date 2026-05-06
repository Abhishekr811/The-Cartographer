import styles from './Typography.module.css'

function Heading({ as: Tag = 'h1', level = 'h1', children, className = '' }) {
  return (
    <Tag className={`${styles.heading} ${styles[level]} ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default Heading
