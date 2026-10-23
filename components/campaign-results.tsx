import type { MarketingResult } from "@/lib/marketing-schema";
import { CopyButton } from "@/components/copy-button";

type CampaignResultsProps = { result: MarketingResult };

function platformLabel(platform: "instagram" | "facebook") {
  return platform === "instagram" ? "Instagram" : "Facebook";
}

function formatLabel(format: string) {
  return format.charAt(0).toUpperCase() + format.slice(1);
}

export function CampaignResults({ result }: CampaignResultsProps) {
  return (
    <div className="campaign-results">
      <section className="campaign-objective">
        <span className="result-section-label">CAMPAIGN OBJECTIVE</span>
        <p>{result.campaignSummary}</p>
      </section>

      <section className="result-section" aria-labelledby="social-results-title">
        <div className="result-section-heading"><div><span className="result-step">01</span><h3 id="social-results-title">Social content</h3></div><p>Tailored for each platform you selected.</p></div>
        <div className="social-result-grid">
          {result.socialContent.map((item) => (
            <article className="social-result-card" key={item.platform}>
              <div className={`platform-badge ${item.platform}`}><span aria-hidden="true">{item.platform === "instagram" ? "◎" : "f"}</span>{platformLabel(item.platform)}</div>
              <h4>{item.headline}</h4>
              <p className="generated-caption">{item.caption}</p>
              {item.hashtags.length > 0 && <p className="generated-hashtags">{item.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join("  ")}</p>}
              <div className="generated-cta"><span>CALL TO ACTION</span><p>{item.callToAction}</p></div>
              <CopyButton text={[
                item.headline,
                item.caption,
                item.hashtags.length ? item.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join(" ") : "",
                `Call to action: ${item.callToAction}`,
              ].filter(Boolean).join("\n\n")} />
            </article>
          ))}
        </div>
      </section>

      <section className="result-section" aria-labelledby="campaign-plan-title">
        <div className="result-section-heading"><div><span className="result-step">02</span><h3 id="campaign-plan-title">Your seven-day plan</h3></div><p>One coordinated schedule across your platforms.</p></div>
        <div className="campaign-day-list">
          {result.campaignPlan.map((day) => (
            <details className="campaign-day" key={day.day} open={day.day === 1}>
              <summary><span className="day-number">Day {String(day.day).padStart(2, "0")}</span><span className="day-summary-idea">{day.contentIdea}</span><span className="format-chip">{formatLabel(day.format)}</span><span className="day-chevron" aria-hidden="true">⌄</span></summary>
              <div className="campaign-day-content">
                <div className="day-detail-block"><span>CONTENT IDEA</span><p>{day.contentIdea}</p></div>
                <div className="day-caption-list">
                  {day.captions.map((caption) => <div className="day-caption" key={caption.platform}><span>{platformLabel(caption.platform)} caption</span><p>{caption.caption}</p></div>)}
                </div>
                <div className="day-meta-grid">
                  <div className="day-detail-block"><span>CALL TO ACTION</span><p>{day.callToAction}</p></div>
                  <div className="day-detail-block metric-block"><span>SUGGESTED METRIC TO TRACK</span><p>{day.suggestedMetric}</p></div>
                </div>
              </div>
            </details>
          ))}
        </div>
        <p className="metrics-disclaimer"><span aria-hidden="true">ⓘ</span> Metrics are suggestions to track. They are not live performance data or predicted results.</p>
      </section>
    </div>
  );
}
