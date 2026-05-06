import styles from './Interaction.module.css'

function HoverHighlightWrapper({ as: Tag = 'div', children, className = '', ...rest }) {
  return <Tag className={`${styles.hoverHighlight} ${className}`.trim()} {...rest}>{children}</Tag>
}

export default HoverHighlightWrapper
