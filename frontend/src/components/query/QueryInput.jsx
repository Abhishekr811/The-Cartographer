import { useState } from 'react';
import Label from '../typography/Label'
import Text from '../typography/Text'
import styles from './QueryInput.module.css'

function QueryInput({ value, onSubmit, disabled = false }) {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const topic = localValue.trim();
    if (topic) {
      onSubmit(topic);
    }
  };

  return (
    <form className={styles.queryShell} onSubmit={handleSubmit}>
      <Label as="label" htmlFor="rse-query-input">
        State of research
      </Label>
      <div className={styles.queryRow}>
        <input
          id="rse-query-input"
          className={styles.queryInput}
          value={localValue}
          onChange={(event) => setLocalValue(event.target.value)}
          onFocus={(event) => event.target.select()}
          placeholder="Enter research topic..."
          disabled={disabled}
        />
        <button className={styles.queryButton} type="submit" disabled={disabled || !localValue.trim()}>
          Search
        </button>
      </div>
      <div className={styles.queryMeta}>
        <Text>Submit a topic to run live retrieval and state computation.</Text>
        <Text>Press Enter or click Search.</Text>
      </div>
    </form>
  )
}

export default QueryInput
