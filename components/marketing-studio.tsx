"use client";

import { useState, type FormEvent } from "react";
import {
  blankMarketingBrief,
  brandTones,
  marketingBriefSchema,
  marketingGoals,
  platformOptions,
  type MarketingBrief,
  type MarketingBriefFormState,
} from "@/lib/marketing-schema";
import { sampleBusiness } from "@/lib/sample-business";

type FieldErrors = Partial<Record<keyof MarketingBrief, string>>;

export function MarketingStudio() {
  const [brief, setBrief] = useState<MarketingBriefFormState>(blankMarketingBrief);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState("");
  const offerRequired = brief.marketingGoal === "special_offer";

  function updateBrief<K extends keyof MarketingBriefFormState>(key: K, value: MarketingBriefFormState[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (key === "marketingGoal" && value !== "special_offer") delete next.offer;
      return next;
    });
    setSummary("");
  }

  function togglePlatform(platform: "instagram" | "facebook") {
    const platforms = brief.platforms.includes(platform)
      ? brief.platforms.filter((item) => item !== platform)
      : [...brief.platforms, platform];
    updateBrief("platforms", platforms);
  }

  function loadSample() {
    setBrief(sampleBusiness);
    setErrors({});
    setSummary("Sample business loaded — edit any field to personalize your brief.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = marketingBriefSchema.safeParse(brief);
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof MarketingBrief;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setSummary("Complete the highlighted fields before generating your marketing campaign.");
      const firstInvalid = Object.keys(nextErrors)[0] as keyof MarketingBrief;
      requestAnimationFrame(() => {
        const field = document.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`);
        const focusTarget = field?.matches("input, button, [tabindex]")
          ? field
          : field?.querySelector<HTMLElement>("input, button, [tabindex]");
        field?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        focusTarget?.focus();
      });
      return;
    }
    setErrors({});
    setSummary("Your brief is ready. Campaign generation will be connected in the next build slice.");
  }

  const errorCount = Object.keys(errors).length;

  return (
    <main className="studio-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AI Marketing Studio home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>AI Marketing Studio</span>
        </a>
        <span className="preview-badge"><span /> A simpler way to market</span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR SMALL BUSINESS MARKETING PARTNER</div>
        <h1>Turn your business idea into a <span>marketing campaign.</span></h1>
        <p>Share a few details. Get social content and a clear seven-day plan, all built around your business.</p>
      </section>

      <section className="workspace" aria-label="Marketing workspace">
        <form className="brief-card" onSubmit={handleSubmit} noValidate>
          <div className="card-heading">
            <div className="brief-heading-copy">
              <div className="heading-icon" aria-hidden="true">01</div>
              <div><h2>Your business brief</h2><p>The details that shape your campaign.</p></div>
            </div>
            <button className="sample-button sample-button-top" type="button" onClick={loadSample}><span aria-hidden="true">✦</span> Try sample business</button>
          </div>

          {summary && <div className={`form-summary ${errorCount ? "has-errors" : "is-info"}`} role={errorCount ? "alert" : "status"}>
            <strong>{errorCount ? `${errorCount} ${errorCount === 1 ? "detail is" : "details are"} still needed` : summary.startsWith("Sample business loaded") ? "Sample business loaded" : "Brief ready"}</strong>
            <span>{summary}</span>
            {errorCount > 1 && <span className="preserve-note">Your other entries are saved in this form.</span>}
          </div>}

          <div className="field-grid">
            <div className="field" data-field="businessName">
              <label htmlFor="businessName">Business name <span className="required">*</span></label>
              <input id="businessName" name="businessName" maxLength={80} placeholder="e.g. Daily Grind Coffee" value={brief.businessName} aria-invalid={Boolean(errors.businessName)} aria-describedby={errors.businessName ? "businessName-error" : undefined} onChange={(e) => updateBrief("businessName", e.target.value)} />
              {errors.businessName && <p className="field-error" id="businessName-error">{errors.businessName}</p>}
            </div>
            <div className="field" data-field="productOrService">
              <label htmlFor="productOrService">Product or service <span className="required">*</span></label>
              <input id="productOrService" name="productOrService" maxLength={160} placeholder="e.g. Iced coffee and matcha latte" value={brief.productOrService} aria-invalid={Boolean(errors.productOrService)} aria-describedby={errors.productOrService ? "productOrService-error" : undefined} onChange={(e) => updateBrief("productOrService", e.target.value)} />
              {errors.productOrService && <p className="field-error" id="productOrService-error">{errors.productOrService}</p>}
            </div>
            <div className="field" data-field="offer">
              <label htmlFor="offer">Offer or promotion <span className="optional">{offerRequired ? "Required for this goal" : "Optional"}</span></label>
              <input id="offer" name="offer" maxLength={180} placeholder="e.g. 10% off selected drinks this weekend" value={brief.offer ?? ""} aria-invalid={Boolean(errors.offer)} aria-describedby={errors.offer ? "offer-error" : "offer-hint"} onChange={(e) => updateBrief("offer", e.target.value)} />
              {errors.offer ? <p className="field-error" id="offer-error">{errors.offer}</p> : <p className="field-hint" id="offer-hint">Only add this if you have a specific offer to promote.</p>}
            </div>
            <div className="field" data-field="targetAudience">
              <label htmlFor="targetAudience">Who are you trying to reach? <span className="required">*</span></label>
              <input id="targetAudience" name="targetAudience" maxLength={160} placeholder="e.g. College students and young professionals" value={brief.targetAudience} aria-invalid={Boolean(errors.targetAudience)} aria-describedby={errors.targetAudience ? "targetAudience-error" : undefined} onChange={(e) => updateBrief("targetAudience", e.target.value)} />
              {errors.targetAudience && <p className="field-error" id="targetAudience-error">{errors.targetAudience}</p>}
            </div>
          </div>

          <fieldset className="choice-section" data-field="marketingGoal" tabIndex={-1} aria-describedby={errors.marketingGoal ? "goal-error" : undefined}>
            <legend>What would you like to achieve? <span className="required">*</span></legend>
            <p className="section-help">Pick the one goal that matters most for this campaign.</p>
            <div className="goal-grid">
              {marketingGoals.map((goal) => <label key={goal.value} className={`goal-option ${brief.marketingGoal === goal.value ? "selected" : ""}`}>
                <input type="radio" name="marketingGoal" value={goal.value} checked={brief.marketingGoal === goal.value} onChange={() => updateBrief("marketingGoal", goal.value)} />
                <span className="radio-mark" aria-hidden="true" />
                <span className="goal-copy"><strong>{goal.label}</strong><small>{goal.detail}</small></span>
              </label>)}
            </div>
            {errors.marketingGoal && <p className="field-error" id="goal-error">{errors.marketingGoal}</p>}
          </fieldset>

          <div className="settings-row">
            <fieldset className="setting-block" data-field="platforms" tabIndex={-1} aria-describedby={errors.platforms ? "platform-error" : undefined}>
              <legend>Choose your platforms <span className="required">*</span></legend>
              <p className="section-help">Select one or both.</p>
              <div className="platform-list">
                {platformOptions.map((platform) => <label key={platform.value} className={`platform-option ${brief.platforms.includes(platform.value) ? "selected" : ""}`}>
                  <input type="checkbox" name="platforms" value={platform.value} checked={brief.platforms.includes(platform.value)} onChange={() => togglePlatform(platform.value)} />
                  <span className="checkbox-mark" aria-hidden="true">✓</span><span>{platform.label}</span>
                </label>)}
              </div>
              {errors.platforms && <p className="field-error" id="platform-error">{errors.platforms}</p>}
            </fieldset>
            <fieldset className="setting-block">
              <legend>Brand voice</legend>
              <p className="section-help">How should the message sound?</p>
              <div className="tone-list">
                {brandTones.map((tone) => <label key={tone} className={`tone-option ${brief.brandTone === tone ? "selected" : ""}`}>
                  <input type="radio" name="brandTone" value={tone} checked={brief.brandTone === tone} onChange={() => updateBrief("brandTone", tone)} />
                  <span>{tone[0].toUpperCase() + tone.slice(1)}</span>
                </label>)}
              </div>
            </fieldset>
          </div>

          <div className="privacy-note"><span aria-hidden="true">ⓘ</span><p>When you generate a plan, your brief will be sent to OpenAI and is not saved by this app. Don’t include confidential details or customer personal data.</p></div>
          <div className="form-actions">
            <button className="primary-button" type="submit">Check my brief <span aria-hidden="true">→</span></button>
            <p className="action-note">You can edit everything before generating your plan.</p>
          </div>
        </form>

        <aside className="results-card" aria-label="Campaign results">
          <div className="card-heading">
            <div className="heading-icon lavender" aria-hidden="true">02</div>
            <div><h2>Your campaign</h2><p>Social content and a coordinated seven-day plan.</p></div>
          </div>
          <div className="empty-state">
            <div className="empty-illustration" aria-hidden="true"><span className="spark spark-one">✳</span><span className="doc-icon"><i /><i /><i /></span><span className="spark spark-two">✦</span></div>
            <span className="empty-kicker">YOUR RESULTS WILL APPEAR HERE</span>
            <h3>Ready when you are</h3>
            <p>Complete your business brief to see platform-tailored social content and a simple campaign plan.</p>
            <div className="result-preview"><span className="preview-pill">INSTAGRAM + FACEBOOK</span><span className="preview-pill">7-DAY CAMPAIGN</span></div>
          </div>
          <div className="results-footnote"><span className="footnote-dot" /> Suggested metrics are ideas to track, not live performance data.</div>
        </aside>
      </section>
      <footer className="page-footer"><span>Thoughtful marketing starts with knowing your business.</span><span>AI Marketing Studio <b>·</b> MVP preview</span></footer>
    </main>
  );
}
