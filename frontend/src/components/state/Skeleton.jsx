import styles from "./Skeleton.module.css";

function Skeleton({ lines = 3, height = "1em" }) {
  return (
    <div className={styles.skeleton} aria-label="Loading...">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={styles.line} style={{ height }} />
      ))}{" "}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.card} aria-label="Loading...">
      <div className={styles.cardHeader} />
      <div className={styles.cardBody} />
    </div>
  );
}

function SkeletonClaim() {
  return (
    <div className={styles.claim} aria-label="Loading...">
      <div className={styles.claimTitle} />
      <div className={styles.claimMeta} />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonClaim };