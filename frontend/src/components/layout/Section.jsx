import styles from './Layout.module.css'

function Section({ title, description, children, className = '' }) {
  return (
    <section className={`${styles.section} ${className}`.trim()}>
      {(title || description) && (
        <div className={styles.sectionHeader}>
          {title}
          {description}
        </div>
      )}
      {children}
    </section>
  )
}

export default Section
