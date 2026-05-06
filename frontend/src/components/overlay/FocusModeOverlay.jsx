import ActionButton from '../interaction/ActionButton'
import RelationGraph from '../advanced/RelationGraph'
import Label from '../typography/Label'
import Subheading from '../typography/Subheading'
import Text from '../typography/Text'
import styles from './FocusModeOverlay.module.css'

function FocusModeOverlay({ claim, evidence, relations, claims = [], onClose }) {
  if (!claim) {
    return null
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Focus mode">
      <header className={styles.overlayHeader}>
        <ActionButton variant="ghost" onClick={onClose}>
          Exit focus
        </ActionButton>
      </header>

      <div className={styles.overlayBody}>
        <section className={styles.contextPanel}>
          <Label>{claim.state}</Label>
          <Subheading>{claim.title}</Subheading>
          <Text>{claim.source}</Text>
          <Text>
            This view isolates the active claim and dims peripheral context for closer reasoning.
          </Text>
        </section>

        <section className={styles.graphPanel}>
            <RelationGraph
              relations={relations || []}
              claims={claims}
            />
        </section>

        <section className={styles.evidencePanel}>
          <div>
            <Label>Supporting evidence</Label>
            <div className={styles.evidenceList}>
              {evidence.support.map((item) => (
                <article key={item.title} className={styles.evidenceItem}>
                  <Subheading as="h4">{item.title}</Subheading>
                  <Text>{item.source}</Text>
                </article>
              ))}
            </div>
          </div>
          <div>
            <Label>Opposing evidence</Label>
            <div className={styles.evidenceList}>
              {evidence.opposition.map((item) => (
                <article key={item.title} className={styles.evidenceItem}>
                  <Subheading as="h4">{item.title}</Subheading>
                  <Text>{item.source}</Text>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FocusModeOverlay
