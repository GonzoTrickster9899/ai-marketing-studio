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
      <section className="campaign-objective" aria-labelledby="campaign-objective-title">
        <h3 id="campaign-objective-title">Campaign objective</h3>
        <p>{result.campaignSummary}</p>
      </section>

      <section className="result-section" aria-labelledby="social-results-title">
        <div className="result-section-heading">
          <div><span className="result-step">01</span><h3 id="social-results-title">Social content</h3></div>
          <p>Tailored for each platform you selected.</p>
        </div>
        <div className="social-result-grid">
          {result.socialContent.map((item) => (
            <article className="social-result-card" key={item.platform}>
              <div className="social-card-header">
                <h4 className={`platform-badge ${item.platform}`}>
                  <span aria-hidden="true">{item.platform === "instagram" ? "IG" : "f"}</span>
                  {platformLabel(item.platform)}
                </h4>
                <span className="content-kind">Caption</span>
              </div>
              <h5 className="social-card-title">{item.headline}</h5>
              <p className="generated-caption">{item.caption}</p>
              {item.hashtags.length > 0 && (
                <p className="generated-hashtags">
                  {item.hashtags.map((tag) => `#${tag.replace(/^#/, "")}`).join("  ")}
                </p>
              )}
              <div className="generated-cta">
                <h5>Call to action</h5>
                <p>{item.callToAction}</p>
              </div>
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
        <div className="result-section-heading">
          <div><span className="result-step">02</span><h3 id="campaign-plan-title">Your seven-day plan</h3></div>
          <p>One coordinated schedule across your platforms.</p>
        </div>
        <div className="campaign-day-list">
          {result.campaignPlan.map((day) => (
            <details className="campaign-day" key={day.day} open={day.day === 1}>
              <summary className="campaign-day-summary">
                <span className="day-number">Day {String(day.day).padStart(2, "0")}</span>
                <span className="day-summary-idea">{day.contentIdea}</span>
                <span className="format-chip">{formatLabel(day.format)}</span>
                <span className="day-chevron" aria-hidden="true" />
              </summary>
              <div className="campaign-day-content">
                <section className="day-detail-block idea-block">
                  <h4>Content idea</h4>
                  <p>{day.contentIdea}</p>
                </section>
                <section className="day-caption-section" aria-label={`Day ${day.day} platform captions`}>
                  <h4>Platform captions</h4>
                  <div className="day-caption-list">
                    {day.captions.map((caption) => (
                      <article className="day-caption" key={caption.platform}>
                        <h5>{platformLabel(caption.platform)}</h5>
                        <p>{caption.caption}</p>
                      </article>
                    ))}
                  </div>
                </section>
                <div className="day-meta-grid">
                  <section className="day-detail-block">
                    <h4>Call to action</h4>
                    <p>{day.callToAction}</p>
                  </section>
                  <section className="day-detail-block metric-block">
                    <h4>Suggested metric</h4>
                    <p>{day.suggestedMetric}</p>
                  </section>
                </div>
              </div>
            </details>
          ))}
        </div>
        <p className="metrics-disclaimer"><span aria-hidden="true">i</span> Metrics are suggestions to track. They are not live performance data or predicted results.</p>
      </section>
    </div>
  );
}
