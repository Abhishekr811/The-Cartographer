import Label from '../typography/Label'
import Subheading from '../typography/Subheading'
import Text from '../typography/Text'
import styles from './Advanced.module.css'

function DebateBlock({ debated = [] }) {
  if (debated.length === 0) return null;
  const item = debated[0];

  return (
    <section className={styles.debateBlock}>
      <div className={styles.debateGrid}>
        <div className={styles.debateColumn}>
          <Label>Supporting line</Label>
          <Subheading as="h3">{item.coreTension}</Subheading>
          <div className={styles.debateList}>
            <Text className={styles.debateItem}>
              {item.positionA}
            </Text>
          </div>
        </div>
        <div className={styles.debateColumn}>
          <Label>Opposing line</Label>
          <Subheading as="h3">Counter evidence</Subheading>
          <div className={styles.debateList}>
            <Text className={styles.debateItem}>
              {item.positionB}
            </Text>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DebateBlock
