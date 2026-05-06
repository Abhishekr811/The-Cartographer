import HoverHighlightWrapper from '../interaction/HoverHighlightWrapper'
import Label from '../typography/Label'
import Subheading from '../typography/Subheading'
import Text from '../typography/Text'
import StateIndicator from './StateIndicator'
import styles from './State.module.css'

function StateCard({ title, state, description, claims }) {
  return (
    <HoverHighlightWrapper className={styles.stateCard} data-state={state}>
      <StateIndicator state={state} variant="bar" />
      <div className={styles.stateCardBody}>
        <Label>{state}</Label>
        <Subheading>{title}</Subheading>
        <Text>{description}</Text>
        <Text as="p" size="large" className={styles.stateCardMeta}>
          {claims} mapped claims
        </Text>
      </div>
    </HoverHighlightWrapper>
  )
}

export default StateCard
