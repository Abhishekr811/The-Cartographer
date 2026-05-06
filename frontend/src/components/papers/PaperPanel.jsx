import { useState } from 'react';
import Heading from '../typography/Heading';
import Subheading from '../typography/Subheading';
import Text from '../typography/Text';
import styles from './PaperPanel.module.css';

export default function PaperPanel({ papers = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!papers || !papers.length) return null;

  return (
    <div className={styles.panel}>
      <Heading level="h3" className={styles.header}>Source Papers ({papers.length})</Heading>
      <div className={styles.list}>
        {papers.map((paper) => (
          <article 
            key={paper.paper_id} 
            className={`${styles.paperCard} ${expandedId === paper.paper_id ? styles.expanded : ''}`}
            onClick={() => setExpandedId(expandedId === paper.paper_id ? null : paper.paper_id)}
          >
            <Subheading as="h4" className={styles.title}>{paper.title}</Subheading>
            {expandedId === paper.paper_id ? (
              <Text className={styles.abstract}>{paper.abstract}</Text>
            ) : (
              <Text className={styles.abstractPreview}>
                {paper.abstract.substring(0, 120)}...
              </Text>
            )}
            {expandedId === paper.paper_id && paper.url && (
              <a href={paper.url} target="_blank" rel="noreferrer" className={styles.link} onClick={e => e.stopPropagation()}>
                View Paper ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
