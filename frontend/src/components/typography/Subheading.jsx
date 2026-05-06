import styles from './Typography.module.css'

function Subheading({ as: Tag = 'h2', children, className = '' }) {
  return <Tag className={`${styles.subheading} ${className}`.trim()}>{children}</Tag>
}

export default Subheading
