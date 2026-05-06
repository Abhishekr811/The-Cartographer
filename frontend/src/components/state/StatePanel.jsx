import StateCard from './StateCard'
import styles from './StatePanel.module.css'

function StatePanel({ stateCards }) {
  if (!stateCards) return null;
  return (
    <section className={styles.statePanel}>
      <div className={styles.statePanelItem}>
        <StateCard
          title="Established"
          state="established"
          description="Findings repeatedly supported across high-quality sources with stable reproducibility."
          claims={stateCards.established?.length || 0}
        />
      </div>
      <div className={styles.statePanelItem}>
        <StateCard
          title="Debated"
          state="debated"
          description="Evidence conflict remains active. Source quality is strong but interpretations diverge."
          claims={stateCards.debated?.length || 0}
        />
      </div>
      <div className={styles.statePanelItem}>
        <StateCard
          title="Unknown"
          state="unknown"
          description="Current literature has meaningful blind spots where direct evidence is still missing."
          claims={stateCards.unknown?.length || 0}
        />
      </div>
    </section>
  )
}

export default StatePanel
