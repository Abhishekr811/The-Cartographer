import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButton from "../components/interaction/ActionButton";
import Heading from "../components/typography/Heading";
import Label from "../components/typography/Label";
import Subheading from "../components/typography/Subheading";
import Text from "../components/typography/Text";
import { Skeleton } from "../components/state/Skeleton";
import { useFocus } from "../hooks/useFocus";
import styles from "./FocusPage.module.css";

function FocusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { claim: routedClaim, fromPage } = location.state ?? {};
  const { focusedClaim, loading, error, loadFocus, closeFocus } = useFocus();

  useEffect(() => {
    if (routedClaim?.id) {
      loadFocus(routedClaim.id);
    }
  }, [routedClaim?.id, loadFocus]);

  const handleExit = () => {
    closeFocus();
    if (fromPage) {
      navigate(fromPage);
    } else {
      navigate("/query");
    }
  };

  if (error) {
    return (
      <div className={styles.focusShell}>
        <header className={styles.header}>
          <ActionButton variant="ghost" type="button" onClick={handleExit}>
            Exit focus
          </ActionButton>
        </header>
        <div className={styles.grid}>
          <Text>Unable to load research state</Text>
          <button onClick={() => routedClaim?.id && loadFocus(routedClaim.id)}>Retry</button>
        </div>
      </div>
    );
  }

  const displayClaim = focusedClaim ?? routedClaim ?? null;

  if (!displayClaim && !loading) {
    return (
      <div className={styles.focusShell}>
        <header className={styles.header}>
          <ActionButton variant="ghost" type="button" onClick={handleExit}>
            Exit focus
          </ActionButton>
        </header>
        <div className={styles.grid}>
          <Text>No claim selected</Text>
        </div>
      </div>
    );
  }

  const getConfidenceClass = (confidence) => {
    return styles[confidence?.toLowerCase() ?? "low"];
  };

  return (
    <div className={styles.focusShell}>
      <header className={styles.header}>
        <ActionButton variant="ghost" type="button" onClick={handleExit}>
          Exit focus
        </ActionButton>
      </header>

      <div className={styles.grid}>
        <section className={styles.contextCol}>
          {loading ? (
            <Skeleton lines={4} />
          ) : (
            <>
              <Label>{displayClaim.state}</Label>
              <Heading as="h1" level="h1">
                {displayClaim.title}
              </Heading>
              <Text size="large">{displayClaim.context}</Text>
              <div className={styles.claimMeta}>
                <span className={styles.claimId}>Node #{displayClaim.id.split('-').pop()}</span>
                <span className={styles.claimConfidence}>Confidence: {displayClaim.confidence}</span>
              </div>
            </>
          )}
        </section>

        <section className={styles.graphCol}>
          <div className={styles.graphCanvas}>
            <Subheading as="h3">Relationship graph</Subheading>
            <Text>Interactive node-edge reasoning visualization</Text>
          </div>
        </section>

        <section className={styles.evidenceCol}>
          {loading ? (
            <Skeleton lines={3} />
          ) : (
            <>
              <div className={styles.evidenceSection}>
                <Label>Supporting evidence</Label>
                {(displayClaim.support || []).map((item) => (
                  <article key={item.title} className={styles.evidenceItem}>
                    <Subheading as="h4">{item.title}</Subheading>
                    <Text>
                      {item.source}
                      <span
                        className={`${styles.confidenceTag} ${getConfidenceClass(item.confidence)}`}
                      >
                        {item.confidence}
                      </span>
                    </Text>
                  </article>
                ))}
              </div>

              <div className={styles.evidenceSection}>
                <Label>Opposing evidence</Label>
                {(displayClaim.opposition || []).map((item) => (
                  <article key={item.title} className={styles.evidenceItem}>
                    <Subheading as="h4">{item.title}</Subheading>
                    <Text>
                      {item.source}
                      <span
                        className={`${styles.confidenceTag} ${getConfidenceClass(item.confidence)}`}
                      >
                        {item.confidence}
                      </span>
                    </Text>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default FocusPage;