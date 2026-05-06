import HoverHighlightWrapper from '../interaction/HoverHighlightWrapper'
import Label from '../typography/Label'
import Subheading from '../typography/Subheading'
import Text from '../typography/Text'
import styles from './Claims.module.css'

function ClaimItem({ item, onSelect }) {
  return (
    <HoverHighlightWrapper
      as="button"
      type="button"
      className={`${styles.claimItem}`}
      onClick={() => onSelect(item)}
    >
      <div className={styles.claimHeader}>
        <Label>{item.type}</Label>
        <span className={styles.confidenceTag}>{item.confidence}</span>
      </div>
      <Subheading as="h4">{item.text}</Subheading>
      <div className={styles.claimMeta}>
        <Text as="span">Open focus</Text>
      </div>
    </HoverHighlightWrapper>
  )
}

export default ClaimItem
