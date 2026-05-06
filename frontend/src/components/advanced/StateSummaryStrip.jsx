import Label from '../typography/Label'
import Text from '../typography/Text'
import StateIndicator from '../state/StateIndicator'
import styles from './Advanced.module.css'

function StateSummaryStrip({ metrics, loading }) {
  if (loading || !metrics?.length) {
    return (
      <div className={styles.summaryStrip}>
        {[0, 1, 2].map((i) => (
          <div className={styles.summaryMetric} key={i}>
            <div className={styles.skeletonDot} />
            <div className={styles.skeletonLabel} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.summaryStrip}>
      {metrics.map((metric) => (
        <div className={styles.summaryMetric} key={metric.label}>
          <StateIndicator state={metric.tone} />
          <Label>{metric.label}</Label>
          <Text as="span">{metric.value}</Text>
        </div>
      ))}
    </div>
  );
}

export default StateSummaryStrip
