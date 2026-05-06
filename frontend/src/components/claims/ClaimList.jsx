import ClaimItem from './ClaimItem'
import styles from './Claims.module.css'

function ClaimList({ items, onSelect }) {
  return (
    <div className={styles.claimList}>
      {items.map((item) => (
        <ClaimItem key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default ClaimList
