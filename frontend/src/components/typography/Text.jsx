import styles from './Typography.module.css'

function Text({ as: Tag = 'p', size = 'base', children, className = '' }) {
  const sizeClass = size === 'large' ? styles.textLarge : ''
  return <Tag className={`${styles.text} ${sizeClass} ${className}`.trim()}>{children}</Tag>
}

export default Text
