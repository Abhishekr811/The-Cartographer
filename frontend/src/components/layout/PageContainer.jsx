import styles from './Layout.module.css'

function PageContainer({ children }) {
  return <div className={styles.pageContainer}>{children}</div>
}

export default PageContainer
