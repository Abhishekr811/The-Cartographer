import { useState, useEffect } from "react";

import DebateBlock from "../components/advanced/DebateBlock";
import StateSummaryStrip from "../components/advanced/StateSummaryStrip";
import ClaimList from "../components/claims/ClaimList";
import ActionButton from "../components/interaction/ActionButton";
import FlexWrapper from "../components/layout/FlexWrapper";
import PageContainer from "../components/layout/PageContainer";
import Section from "../components/layout/Section";
import FocusModeOverlay from "../components/overlay/FocusModeOverlay";
import PaperPanel from "../components/papers/PaperPanel";
import ChatPanel from "../components/chat/ChatPanel";
import QueryInput from "../components/query/QueryInput";
import StatePanel from "../components/state/StatePanel";
import StructuredSummary from "../components/state/StructuredSummary";
import RelationGraph from "../components/advanced/RelationGraph";
import { SkeletonCard } from "../components/state/Skeleton";
import Heading from "../components/typography/Heading";
import Text from "../components/typography/Text";
import { useQuery } from "../hooks/useQuery";
import { useClaims } from "../hooks/useClaims";
import { useFocus } from "../hooks/useFocus";
import { useRelations } from "../hooks/useRelations";
import { useSynthesis } from "../hooks/useSynthesis";
import SynthesisPanel from "../components/synthesis/SynthesisPanel";
import styles from "./QueryPage.module.css";

function QueryPage() {
  const [query, setQuery] = useState(localStorage.getItem("rse_latest_topic") || "");
  const [sidePanelWidth, setSidePanelWidth] = useState(() => {
    return parseInt(localStorage.getItem('rse_panel_width') || '350', 10);
  });
  const [isDragging, setIsDragging] = useState(false);
  const { state, loading, error, submitQuery, reset } = useQuery();
  const { claims, loadClaims, error: claimsError } = useClaims();
  const { focusedClaim, loadFocus, closeFocus } = useFocus();
  const { relations, loadRelations, reset: resetRelations } = useRelations();
  const { nodes: synthesisNodes, loading: synthesisLoading, generate: generateSynthesis, reset: resetSynthesis } = useSynthesis();

  useEffect(() => {
    if (state?.topicId) {
      loadClaims(state.topicId);
      loadRelations(state.topicId);
    }
  }, [state?.topicId, loadClaims, loadRelations]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 600) {
        setSidePanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem('rse_panel_width', sidePanelWidth.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, sidePanelWidth]);

  const handleGenerateSynthesis = () => {
    generateSynthesis(claims.map(c => c.id));
  };

  const handleSubmit = (newTopic) => {
    setQuery(newTopic);
    localStorage.setItem("rse_latest_topic", newTopic);
    submitQuery(newTopic);
  };

  const openFocusForClaim = async (claim) => {
    await loadFocus(claim.id);
  };



  return (
    <>
      <div className={styles.layout}>
        <div className={`${styles.mainContent} ${focusedClaim ? styles.focusMuted : ""}`}>
          <PageContainer>
          <Section
            title={<Heading level="display">Query</Heading>}
            description={
              <Text size="large">
                Interactive reasoning view for live research-state resolution.
              </Text>
            }
          >
            <QueryInput key={query} value={query} onSubmit={handleSubmit} disabled={loading} />
          </Section>

          {error || claimsError?.includes("404") ? (
            <Section>
              <Text style={{ color: 'var(--state-debated)' }}>
                {claimsError?.includes("404") 
                  ? "The research session has expired (possibly due to a server restart). Please run your search again." 
                  : `Unable to load research state: ${error || claimsError}`}
              </Text>
              <ActionButton onClick={() => submitQuery(query)}>Run Search</ActionButton>
            </Section>
          ) : !loading && !state ? (
            <Section>
              <Text>Enter a topic and run Search to load live API data.</Text>
            </Section>
          ) : null}

          <SynthesisPanel
            topicId={state?.topicId}
            claims={claims}
            relations={relations}
            synthesisNodes={synthesisNodes}
            onGenerateSynthesis={handleGenerateSynthesis}
            state={state}
            loading={synthesisLoading}
          />

          <Section className={styles.sectionTight}>
            <StateSummaryStrip
              metrics={
                loading
                  ? []
                  : state?.summaryMetrics || []
              }
              loading={loading}
            />
          </Section>

          <Section
            title={<Heading as="h2" level="h2">State panel</Heading>}
            description={
              <Text>State triad generated from current evidence clusters.</Text>
            }
          >
            {loading ? (
              <div className={styles.statePanelGrid}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <>
                <StructuredSummary summary={state?.structuredSummary} />
                <StatePanel stateCards={state?.stateCards} />
              </>
            )}
          </Section>

          <Section
            title={<Heading as="h2" level="h2">Debate block</Heading>}
            description={
              <Text>Supporting and opposing lines shown in parallel structure.</Text>
            }
          >
            <DebateBlock debated={state?.stateCards?.debated} />
          </Section>

          <Section
            id="claim-list-section"
            title={<Heading as="h2" level="h2">Claim list</Heading>}
            description={<Text>Open any claim to enter focused reasoning mode.</Text>}
          >
            <ClaimList items={claims} onSelect={openFocusForClaim} />
            <FlexWrapper className={styles.actionsRow}>
              <ActionButton
                type="button"
                onClick={() => claims[1] && openFocusForClaim(claims[1])}
                disabled={!claims[1]}
              >
                Open focus mode
              </ActionButton>
              <ActionButton
                type="button"
                variant="ghost"
                onClick={() => {
                  reset();
                  setQuery("");
                  localStorage.removeItem("rse_latest_topic");
                  localStorage.removeItem("rse_latest_topic_id");
                  resetRelations();
                  resetSynthesis();
                }}
              >
                Reset query
              </ActionButton>
            </FlexWrapper>
          </Section>

          <Section
            title={<Heading as="h2" level="h2">Relation graph</Heading>}
            description={
              <Text>Visual relationship map showing connections between claims.</Text>
            }
          >
            <RelationGraph relations={relations} claims={claims} onNodeClick={openFocusForClaim} />
          </Section>
        </PageContainer>
        </div>
        
        <div 
          className={`${styles.resizer} ${isDragging ? styles.resizerActive : ""}`} 
          onMouseDown={() => setIsDragging(true)} 
        />
        
        <aside 
          className={`${styles.sidePanelWrapper} ${focusedClaim ? styles.focusMuted : ""}`}
          style={{ width: `${sidePanelWidth}px` }}
        >
          <PaperPanel papers={state?.papers || []} />
        </aside>
      </div>

      {state?.topicId && (
        <ChatPanel 
          topicId={state?.topicId} 
          claims={claims} 
          relations={relations} 
          papers={state?.papers || []} 
        />
      )}

      <FocusModeOverlay
        claim={focusedClaim}
        claims={claims}
        evidence={
          focusedClaim
            ? { support: focusedClaim.support ?? [], opposition: focusedClaim.opposition ?? [] }
            : null
        }
        relations={relations}
        onClose={closeFocus}
      />
    </>
  );
}

export default QueryPage;