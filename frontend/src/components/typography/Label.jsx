import styles from './Typography.module.css'

function Label({ as: Tag = 'p', children, className = '' }) {
  return <Tag className={`${styles.label} ${className}`.trim()}>{children}</Tag>
}

export default Label
