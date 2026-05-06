import { useState, useRef, useLayoutEffect } from "react";
import Heading from "../typography/Heading";
import Label from "../typography/Label";
import Subheading from "../typography/Subheading";
import Text from "../typography/Text";
import StateIndicator from "../state/StateIndicator";
import ActionButton from "../interaction/ActionButton";
import styles from "./SynthesisPanel.module.css";

export default function SynthesisPanel({ 
  topicId, 
  claims = [], 
  relations = [], 
  synthesisNodes = [], 
  onGenerateSynthesis,
  state, 
  loading 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const [nodePositions, setNodePositions] = useState({});

  useLayoutEffect(() => {
    if (!isExpanded || !containerRef.current) return;

    const updatePositions = () => {
      const elements = containerRef.current.querySelectorAll("[data-node-id]");
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = {};
      elements.forEach((el) => {
        const id = el.getAttribute("data-node-id");
        const rect = el.getBoundingClientRect();
        positions[id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });
      setNodePositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    const timeoutId = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener("resize", updatePositions);
      clearTimeout(timeoutId);
    };
  }, [isExpanded, claims, relations]);

  if (!topicId && !loading) return null;

  const hasSynthesis = synthesisNodes.length > 0;

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Heading level="h2">Synthesis</Heading>
          <Text size="small" className={styles.subtitle}>
            Structural insight layer derived from evidence clusters.
          </Text>
        </div>
        <ActionButton 
          variant="ghost" 
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse" : "Expand Synthesis"}
        </ActionButton>
      </div>

      {isExpanded ? (
        <div className={styles.content}>
          <div className={styles.synthesisSummary}>
            <Subheading level="h3">Strategic Overview</Subheading>
            
            {loading && !hasSynthesis ? (
              <div className={styles.loadingState}>
                <Text>Distilling research state...</Text>
              </div>
            ) : hasSynthesis ? (
              <div className={styles.synthesisNodes}>
                {synthesisNodes.map(node => (
                  <div key={node.id} className={styles.synthesisNode}>
                    <div className={styles.nodeMeta}>
                      <Label className={styles.nodeHeading}>{node.heading}</Label>
                      <StateIndicator state={node.state} />
                    </div>
                    <Text className={styles.nodeText}>{node.text}</Text>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noSynthesis}>
                <Text className={styles.summaryText}>
                  No synthesis generated yet.
                </Text>
                <ActionButton size="small" onClick={onGenerateSynthesis}>
                  Generate Synthesis
                </ActionButton>
              </div>
            )}
            
            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <Label>Claims</Label>
                <Text weight="semibold">{claims.length}</Text>
              </div>
              <div className={styles.metric}>
                <Label>Relations</Label>
                <Text weight="semibold">{relations.length}</Text>
              </div>
              <div className={styles.metric}>
                <Label>State</Label>
                <Text weight="semibold" style={{ color: `var(--state-${state?.topicState || 'unknown'})` }}>
                  {state?.topicState || "Processing"}
                </Text>
              </div>
            </div>
            <div className={styles.viewAllAction}>
              <button 
                className={styles.textLink}
                onClick={() => document.getElementById('claim-list-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View all {claims.length} claims in detail ↓
              </button>
            </div>
          </div>

          <div className={styles.canvasWrapper}>
            <div className={styles.canvas} ref={containerRef}>
              <svg className={styles.connections} aria-hidden="true">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-outline-variant)" />
                  </marker>
                </defs>
                {relations.map((rel, i) => {
                  const sourcePos = nodePositions[rel.source];
                  const targetPos = nodePositions[rel.target];
                  if (!sourcePos || !targetPos) return null;

                  const dx = targetPos.x - sourcePos.x;
                  const dy = targetPos.y - sourcePos.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  const isVertical = Math.abs(dx) < 20;
                  const curveOffset = isVertical ? 60 : 0;
                  
                  const cx = sourcePos.x + dx / 2 + curveOffset;
                  const cy = sourcePos.y + dy / 2 - (isVertical ? 0 : distance * 0.1);

                  return (
                    <g key={i}>
                      <path
                        d={`M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`}
                        className={styles.connectionLine}
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })}
              </svg>

              <div className={styles.graphGrid}>
                {claims.slice(0, 6).map((claim, index) => {
                  let gridClass = styles.nodeCore;
                  if (claim.state === "established") gridClass = styles.nodeSupport;
                  if (claim.state === "debated" && index > 1) gridClass = styles.nodeOpposition;
                  if (claim.state === "unknown") gridClass = styles.nodeUnknown;

                  return (
                    <article
                      key={claim.id}
                      data-node-id={claim.id}
                      className={`${styles.node} ${gridClass}`}
                    >
                      <div className={styles.nodeHeader}>
                        <Label>Node {claim.id.split('-').pop().replace("c", "")}</Label>
                        <span
                          className={styles.nodeDot}
                          style={{ background: `var(--state-${claim.state})` }}
                        />
                      </div>
                      <Subheading style={{ fontSize: "0.82rem", lineHeight: "1.2", fontWeight: 600 }}>
                        {claim.title || claim.text}
                      </Subheading>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.collapsedPreview}>
          <div className={styles.previewStats}>
            <Text size="small">
              <span className={styles.statIcon}>◉</span> {claims.length} Claims synthesized
            </Text>
            <Text size="small">
              <span className={styles.statIcon}>⇶</span> {relations.length} Relationships mapped
            </Text>
            {hasSynthesis && (
              <Text size="small">
                <span className={styles.statIcon}>✦</span> Distilled reasoning ready
              </Text>
            )}
          </div>
          {loading ? (
             <Text size="small" className={styles.loadingText}>Synthesizing...</Text>
          ) : !hasSynthesis && claims.length > 0 && (
             <ActionButton size="small" onClick={onGenerateSynthesis}>
               Generate Synthesis
             </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}
