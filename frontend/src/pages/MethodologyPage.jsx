import PageContainer from '../components/layout/PageContainer'
import Section from '../components/layout/Section'
import Heading from '../components/typography/Heading'
import Subheading from '../components/typography/Subheading'
import Text from '../components/typography/Text'
import styles from './MethodologyPage.module.css'

function MethodologyPage() {
  return (
    <PageContainer>
      <Section
        title={<Heading level="display">About</Heading>}
        description={
          <Text size="large">
            Understanding the Research State Engine.
          </Text>
        }
      >
        <div className={styles.methodStack}>
          <article className={styles.methodSection}>
            <div className={styles.textPaneFull}>
              <Subheading as="h3">1. What this system does</Subheading>
              <Text>The Research State Engine transforms dense academic research into clear, atomic claims. It maps the relationships between these claims and identifies the current knowledge state—whether a topic is established, fiercely debated, or largely unknown.</Text>
            </div>
          </article>
          
          <article className={styles.methodSection}>
            <div className={styles.textPaneFull}>
              <Subheading as="h3">2. Why it exists</Subheading>
              <Text>Researchers and analysts suffer from severe information overload. The lack of structure in traditional literature reviews makes it incredibly difficult to pinpoint contradictions or identify genuine research gaps. This engine was built to provide immediate structural clarity.</Text>
            </div>
          </article>
          
          <article className={styles.methodSection}>
            <div className={styles.textPaneFull}>
              <Subheading as="h3">3. How it works</Subheading>
              <Text>The pipeline follows a strict sequence: <strong>Query → Papers → Claims → Relations → State → Synthesis</strong>. Every insight generated is fully traceable back to the exact source paper that supports it.</Text>
            </div>
          </article>

          <article className={styles.methodSection}>
            <div className={styles.textPaneFull}>
              <Subheading as="h3">4. What makes it different</Subheading>
              <Text>We prioritize claims over entire papers. By breaking documents down, we expose hidden conflicts and provide a highly interactive reasoning environment rather than a static text summary.</Text>
            </div>
          </article>

          <article className={styles.methodSection}>
            <div className={styles.textPaneFull}>
              <Subheading as="h3">5. Limitations</Subheading>
              <Text>The system relies heavily on LLMs for extraction and synthesis, meaning accuracy is evolving. Coverage may be incomplete depending on external API sources, and highly nuanced context can sometimes be lost during claim atomization.</Text>
            </div>
          </article>
        </div>
      </Section>
    </PageContainer>
  )
}

export default MethodologyPage
