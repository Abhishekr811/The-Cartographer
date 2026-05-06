import { useState, useRef, useLayoutEffect } from "react";
import Heading from "../typography/Heading";
import Subheading from "../typography/Subheading";
import Label from "../typography/Label";
import styles from "./Advanced.module.css";

export default function RelationGraph({ relations = [], claims = [], onNodeClick }) {
  const containerRef = useRef(null);
  const [nodePositions, setNodePositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !claims.length) return;

    const updatePositions = () => {
      const elements = containerRef.current.querySelectorAll("[data-claim-id]");
      const containerRect = containerRef.current.getBoundingClientRect();
      const positions = {};
      elements.forEach((el) => {
        const id = el.getAttribute("data-claim-id");
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
  }, [claims, relations]);

  if (!claims.length) return null;

  return (
    <div className={styles.visualGraphContainer}>
      <Heading level="h3" style={{ marginBottom: '1rem' }}>Interactive Relationship Map</Heading>
      <div className={styles.canvas} ref={containerRef}>
        <svg className={styles.connections} aria-hidden="true">
          <defs>
            <marker id="arrowhead-default" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-outline-variant)" />
            </marker>
            <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-primary)" />
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

            const isActive = hoveredNode && (hoveredNode === rel.source || hoveredNode === rel.target);
            const isFaded = hoveredNode && !isActive;

            return (
              <g key={i} style={{ opacity: isFaded ? 0.2 : 1, transition: 'opacity 0.2s' }}>
                <path
                  d={`M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`}
                  className={`${styles.connectionLine} ${isActive ? styles.connectionLineActive : ''}`}
                  markerEnd={`url(#arrowhead-${isActive ? 'active' : 'default'})`}
                />
              </g>
            );
          })}
        </svg>

        <div className={styles.graphGrid}>
          {claims.map((claim, index) => {
            let gridClass = styles.nodeCore;
            if (claim.type === "established" || claim.state === "established") gridClass = styles.nodeSupport;
            if ((claim.type === "debated" || claim.state === "debated") && index > 1) gridClass = styles.nodeOpposition;
            if (claim.type === "unknown" || claim.state === "unknown") gridClass = styles.nodeUnknown;

            const isHovered = hoveredNode === claim.id;
            const isConnected = hoveredNode && relations.some(r => (r.source === claim.id && r.target === hoveredNode) || (r.target === claim.id && r.source === hoveredNode));
            const isActive = isHovered || isConnected;
            const isFaded = hoveredNode && !isActive;

            return (
              <article
                key={claim.id}
                data-claim-id={claim.id}
                className={`${styles.node} ${gridClass}`}
                style={{ 
                  opacity: isFaded ? 0.3 : 1, 
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  zIndex: isActive ? 10 : 1,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={() => setHoveredNode(claim.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onNodeClick && onNodeClick(claim)}
              >
                <div className={styles.nodeHeader}>
                  <Label>Node {claim.id.split('-').pop().replace("c", "")}</Label>
                  <span
                    className={styles.nodeDot}
                    style={{ background: `var(--state-${claim.type || claim.state})` }}
                  />
                </div>
                <Subheading style={{ fontSize: "0.82rem", lineHeight: "1.2", fontWeight: 600 }}>
                  {claim.text || claim.title}
                </Subheading>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}