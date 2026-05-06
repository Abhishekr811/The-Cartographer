import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Section from "../components/layout/Section";
import Heading from "../components/typography/Heading";
import Label from "../components/typography/Label";
import Subheading from "../components/typography/Subheading";
import Text from "../components/typography/Text";
import StateIndicator from "../components/state/StateIndicator";
import { Skeleton } from "../components/state/Skeleton";
import { useArchive } from "../hooks/useArchive";
import styles from "./ArchivePage.module.css";

function ArchivePage() {
  const navigate = useNavigate();
  const { entries, loading, error, loadArchive } = useArchive();

  useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  const handleEntryClick = (entry) => {
    navigate("/query", { state: { archiveContext: entry } });
  };

  if (error) {
    return (
      <PageContainer>
        <Text>Unable to load research state</Text>
        <button onClick={loadArchive}>Retry</button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section
        title={<Heading level="display">Archive</Heading>}
        description={<Text size="large">Previously explored research states.</Text>}
      >
        <div className={styles.entryList}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.entry}>
                  <Skeleton lines={2} />
                </div>
              ))
            : entries.map((entry) => (
                <article
                  key={entry.id}
                  className={styles.entry}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleEntryClick(entry)}
                  onKeyDown={(e) => e.key === "Enter" && handleEntryClick(entry)}
                >
                  <div className={styles.dateCol}>
                    <Label>{entry.date}</Label>
                    <Text>{entry.time}</Text>
                  </div>
                  <div className={styles.contentCol}>
                    <Subheading as="h3">{entry.title}</Subheading>
                    <Text>{entry.summary}</Text>
                  </div>
                  <div className={styles.metaCol}>
                    <span className={styles.stateTag}>
                      <StateIndicator state={entry.state} /> {entry.state}
                    </span>
                  </div>
                </article>
              ))}
        </div>
      </Section>
    </PageContainer>
  );
}

export default ArchivePage;