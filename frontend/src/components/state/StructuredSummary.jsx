import Heading from '../typography/Heading';
import Subheading from '../typography/Subheading';
import Text from '../typography/Text';
import StateIndicator from '../state/StateIndicator';
import styles from './StructuredSummary.module.css';

export default function StructuredSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.header}>
        <Heading level="h3">State Summary</Heading>
        <div className={styles.confidenceBadge}>
          <Text size="small" weight="semibold">Confidence: {summary.confidence}</Text>
        </div>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.column}>
          <Subheading level="h4" className={styles.colTitle}>
            <StateIndicator state="established" /> Key Points
          </Subheading>
          <ul className={styles.list}>
            {summary.key_points.map((point, i) => (
              <li key={i}><Text size="small">{point}</Text></li>
            ))}
          </ul>
        </div>
        
        <div className={styles.column}>
          <Subheading level="h4" className={styles.colTitle}>
            <StateIndicator state="debated" /> Main Conflicts
          </Subheading>
          <ul className={styles.list}>
            {summary.main_conflicts.map((conflict, i) => (
              <li key={i}><Text size="small">{conflict}</Text></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
