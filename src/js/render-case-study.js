export function renderCaseStudies(projects) {
  const p1 = projects.find(p => p.id === 'power-cement');
  const p2 = projects.find(p => p.id === 'industry-4');

  if (p1) {
    const modal1 = document.getElementById(p1.modalId);
    if (modal1) {
      modal1.innerHTML = `
  <div class="cs-panel" id="${p1.panelId}">
    <div class="cs-progress"><div class="cs-progress-fill" id="${p1.progressFillId}"></div></div>

    <div class="cs-topbar">
      <div class="wrap cs-topbar-inner">
        <button type="button" class="cs-back" id="${p1.backBtnId}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          Back to Projects
        </button>
        <button type="button" class="cs-close" id="${p1.closeBtnId}" aria-label="Close case study">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>

    <nav class="cs-nav">
      <div class="wrap cs-nav-inner" id="csNavInner">
        <a href="#cs-overview">Overview</a>
        <a href="#cs-glance">Power Cement</a>
        <a href="#cs-framework">Framework</a>
        <a href="#cs-focus">Focus Areas</a>
        <a href="#cs-sdg">SDGs</a>
        <a href="#cs-challenges">Challenges</a>
        <a href="#cs-split">Procurement &amp; Tech</a>
        <a href="#cs-findings">Findings</a>
        <a href="#cs-roadmap">Roadmap</a>
        <a href="#cs-limitations">Limitations</a>
        <a href="#cs-final">Takeaway</a>
      </div>
    </nav>

    <!-- SECTION 1: OVERVIEW -->
    <section class="cs-sec" id="cs-overview">
      <div class="wrap">
        <span class="section-label">${p1.overview.sectionLabel}</span>
        <h2 class="cs-h2" id="csTitle">${p1.overview.heading}</h2>
        <p class="cs-intro">${p1.overview.intro}</p>

        <div class="cs-info-grid">
          ${p1.overview.infoCards.map(c => `
          <div class="cs-info-card">
            <span class="cs-info-num">${c.num}</span>
            <div class="cs-info-icon">${c.icon}</div>
            <div class="cs-info-k">${c.key}</div>
            <div class="cs-info-v">${c.value}</div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 2: POWER CEMENT AT A GLANCE -->
    <section class="cs-sec cs-glance" id="cs-glance">
      <div class="wrap">
        <span class="section-label">${p1.metrics.sectionLabel}</span>
        <h2 class="cs-h2">${p1.metrics.heading}</h2>
        <p class="cs-intro">${p1.metrics.intro}</p>

        <div class="cs-metric-grid">
          ${p1.metrics.items.map(m => `
          <div class="cs-metric"><div class="cs-metric-value" data-countup="${m.value}"${m.suffix ? ` data-suffix="${m.suffix}"` : ''}>0</div><div class="cs-metric-label">${m.label}</div></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 3: RESEARCH FRAMEWORK -->
    <section class="cs-sec" id="cs-framework">
      <div class="wrap">
        <span class="section-label">${p1.methodology.sectionLabel}</span>
        <h2 class="cs-h2">${p1.methodology.heading}</h2>
        <p class="cs-intro">${p1.methodology.intro}</p>

        <div class="cs-fw-list">
          ${p1.methodology.stages.map(s => `
          <div class="cs-fw-item">
            <span class="cs-fw-dot"></span>
            <button type="button" class="cs-fw-btn">
              <span class="t">${s.title}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="cs-fw-body"><p>${s.desc}</p></div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 4: FOCUS AREAS -->
    <section class="cs-sec" id="cs-focus">
      <div class="wrap">
        <span class="section-label">${p1.focusAreas.sectionLabel}</span>
        <h2 class="cs-h2">${p1.focusAreas.heading}</h2>

        <div class="cs-focus-grid">
          ${p1.focusAreas.items.map(f => `
          <div class="cs-focus-card">
            <span class="cs-focus-num">${f.num}</span>
            <div class="cs-focus-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h16M12 4v16" stroke-linecap="round"/><circle cx="12" cy="12" r="9"/></svg></div>
            <h4>${f.title}</h4>
            <p>${f.summary}</p>
            <div class="cs-focus-more"><p>${f.details}</p></div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 5: SUSTAINABILITY & SDGs -->
    <section class="cs-sec" id="cs-sdg">
      <div class="wrap">
        <span class="section-label">${p1.sdgs.sectionLabel}</span>
        <h2 class="cs-h2">${p1.sdgs.heading}</h2>

        <div class="cs-sdg-grid">
          ${p1.sdgs.cards.map(card => `
          <div class="cs-sdg-card" tabindex="0">
            <span class="cs-sdg-tag">${card.tag}</span>
            <h4>${card.title}</h4>
            <ul class="cs-sdg-list">
              ${card.list.map(li => `<li>${li}</li>`).join('')}
            </ul>
            <p class="cs-sdg-note">${card.note}</p>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 6: KEY CHALLENGES -->
    <section class="cs-sec" id="cs-challenges">
      <div class="wrap">
        <span class="section-label">${p1.challenges.sectionLabel}</span>
        <h2 class="cs-h2">${p1.challenges.heading}</h2>

        <div class="cs-challenge-row">
          ${p1.challenges.items.map(ch => `
          <div class="cs-challenge">
            <div class="cs-challenge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v10M12 21a1.4 1.4 0 1 0 0-2.8A1.4 1.4 0 0 0 12 21z" stroke-linecap="round"/></svg></div>
            <p>${ch}</p>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 7: PROCUREMENT & TECHNOLOGY -->
    <section class="cs-sec" id="cs-split">
      <div class="wrap">
        <span class="section-label">${p1.procurementEvolution.sectionLabel}</span>
        <h2 class="cs-h2">${p1.procurementEvolution.heading}</h2>

        <div class="cs-split">
          <div>
            <h4>${p1.procurementEvolution.procurement.title}</h4>
            <p class="lead">${p1.procurementEvolution.procurement.lead}</p>
            <div class="cs-evo">
              ${p1.procurementEvolution.procurement.steps.map((st, i, arr) => `
              <div class="cs-evo-step">${st}</div>
              ${i < arr.length - 1 ? `<div class="cs-evo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>` : ''}
              `).join('')}
            </div>
          </div>
          <div>
            <h4>${p1.procurementEvolution.techStack.title}</h4>
            <p class="lead">${p1.procurementEvolution.techStack.lead}</p>
            <div class="cs-net">
              ${p1.procurementEvolution.techStack.tiers.map((tier, i, arr) => `
              <div class="cs-net-row">
                ${tier.map((node, ni, narr) => `
                <span class="cs-net-node">${node}</span>
                ${ni < narr.length - 1 ? `<span class="cs-net-arrow">→</span>` : ''}
                `).join('')}
              </div>
              ${i < arr.length - 1 ? `<div class="cs-net-down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>` : ''}
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 8: KEY FINDINGS -->
    <section class="cs-sec" id="cs-findings">
      <div class="wrap">
        <span class="section-label">${p1.findings.sectionLabel}</span>
        <h2 class="cs-h2">${p1.findings.heading}</h2>

        <div class="cs-find-list">
          ${p1.findings.items.map((item, idx) => `
          <div class="cs-find-item"><span class="cs-find-num">0${idx + 1}</span><p>${item}</p></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 9: RECOMMENDATIONS / ROADMAP -->
    <section class="cs-sec" id="cs-roadmap">
      <div class="wrap">
        <span class="section-label">${p1.recommendations.sectionLabel}</span>
        <h2 class="cs-h2">${p1.recommendations.heading}</h2>

        <div class="cs-roadmap">
          <div class="cs-roadmap-line" aria-hidden="true"></div>
          ${p1.recommendations.pillars.map(pillar => `
          <div class="cs-pillar">
            <span class="cs-pillar-num">${pillar.num}</span>
            <h4>${pillar.title}</h4>
            <ul>
              ${pillar.items.map(it => `<li>${it}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 10: RESEARCH LIMITATIONS -->
    <section class="cs-sec" id="cs-limitations">
      <div class="wrap">
        <span class="section-label">${p1.limitations.sectionLabel}</span>
        <h2 class="cs-h2">${p1.limitations.heading}</h2>

        <div class="cs-accordion" id="csLimAccordion">
          <button type="button" class="cs-acc-head" id="csLimHead">
            <span class="t">${p1.limitations.title}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="cs-acc-body">
            <ul>
              ${p1.limitations.items.map(it => `<li>${it}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 11: FINAL TAKEAWAY -->
    <section class="cs-sec cs-final" id="cs-final">
      <div class="wrap cs-final-inner">
        <h3>${p1.takeaway.heading}</h3>
        <p>${p1.takeaway.text}</p>
        <div class="cs-equation">
          ${p1.takeaway.equation.map(eq => `
          <span class="${eq.type === 'op' ? 'eq-op' : eq.type === 'result' ? 'eq-item eq-result' : 'eq-item'}">${eq.text}</span>
          `).join('')}
        </div>
      </div>
    </section>
  </div>`;
    }
  }

  if (p2) {
    const modal2 = document.getElementById(p2.modalId);
    if (modal2) {
      modal2.innerHTML = `
  <div class="cs-panel" id="${p2.panelId}">
    <div class="cs-progress"><div class="cs-progress-fill" id="${p2.progressFillId}"></div></div>

    <div class="cs-topbar">
      <div class="wrap cs-topbar-inner">
        <button type="button" class="cs-back" id="${p2.backBtnId}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          Back to Projects
        </button>
        <button type="button" class="cs-close" id="${p2.closeBtnId}" aria-label="Close case study">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>

    <nav class="cs-nav">
      <div class="wrap cs-nav-inner" id="csNavInnerI4">
        <a href="#i4-overview">Overview</a>
        <a href="#i4-what">What is 4.0?</a>
        <a href="#i4-challenge">The Challenge</a>
        <a href="#i4-complexity">Complexity</a>
        <a href="#i4-people">People</a>
        <a href="#i4-stack">Tech Stack</a>
        <a href="#i4-framework">Frameworks</a>
        <a href="#i4-hypothesis">Hypothesis</a>
        <a href="#i4-benefits">Benefits</a>
        <a href="#i4-roadmap">Roadmap</a>
        <a href="#i4-success">Success Areas</a>
        <a href="#i4-insight">Insight</a>
        <a href="#i4-final">Takeaway</a>
      </div>
    </nav>

    <!-- SECTION 1: OVERVIEW -->
    <section class="cs-sec" id="i4-overview">
      <div class="wrap">
        <span class="section-label">${p2.overview.sectionLabel}</span>
        <h2 class="cs-h2" id="csTitleI4">${p2.overview.heading}</h2>
        <p class="cs-intro">${p2.overview.intro}</p>

        <div class="cs-info-grid">
          ${p2.overview.infoCards.map(c => `
          <div class="cs-info-card">
            <span class="cs-info-num">${c.num}</span>
            <div class="cs-info-icon">${c.icon}</div>
            <div class="cs-info-k">${c.key}</div>
            <div class="cs-info-v">${c.value}</div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 2: WHAT IS INDUSTRY 4.0 -->
    <section class="cs-sec" id="i4-what">
      <div class="wrap">
        <span class="section-label">${p2.evolution.sectionLabel}</span>
        <h2 class="cs-h2">${p2.evolution.heading}</h2>
        <p class="cs-intro">${p2.evolution.intro}</p>

        <div class="i4-evo">
          ${p2.evolution.steps.map((st, i, arr) => `
          <div class="i4-evo-step${st.current ? ' i4-evo-step--now' : ''}"><div class="k">${st.k}</div><div class="v">${st.v}</div></div>
          ${i < arr.length - 1 ? `<div class="i4-evo-sep"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>` : ''}
          `).join('')}
        </div>

        <p class="cs-intro" style="margin-top:36px;">${p2.evolution.technologiesIntro}</p>

        <div class="i4-tech-grid">
          ${p2.evolution.technologies.map(t => `
          <div class="i4-tech-node"><h5>${t.name}</h5><div class="desc">${t.desc}</div></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 3: THE ADOPTION CHALLENGE -->
    <section class="cs-sec" id="i4-challenge">
      <div class="wrap">
        <span class="section-label">${p2.challenges.sectionLabel}</span>
        <h2 class="cs-h2">${p2.challenges.heading}</h2>
        <p class="cs-intro">${p2.challenges.intro}</p>

        <div class="i4-branch-top"><span class="node">Industry 4.0</span></div>
        <div class="i4-branch-lines" aria-hidden="true"></div>
        <div class="i4-branch-cols">
          ${p2.challenges.dimensions.map(dim => `
          <div class="i4-branch-col">
            <h5>${dim.title}</h5>
            <ul>${dim.items.map(it => `<li>${it}</li>`).join('')}</ul>
          </div>
          `).join('')}
        </div>

        <div class="cs-focus-grid i4-challenge-grid" style="margin-top:44px; grid-template-columns:repeat(4,1fr);">
          ${p2.challenges.cards.map(c => `
          <div class="cs-focus-card">
            <span class="cs-focus-num">${c.num}</span>
            <h4>${c.title}</h4>
            <p>${c.summary}</p>
            <div class="cs-focus-more"><p>${c.details}</p></div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 4: TECHNOLOGY COMPLEXITY -->
    <section class="cs-sec" id="i4-complexity">
      <div class="wrap">
        <span class="section-label">${p2.complexity.sectionLabel}</span>
        <h2 class="cs-h2">${p2.complexity.heading}</h2>
        <p class="cs-intro">${p2.complexity.intro}</p>

        <div class="cs-split">
          <div>
            <h4>Data-to-Decision Flow</h4>
            <p class="lead">Connected devices generate the raw data that intelligent systems turn into action.</p>
            <div class="cs-evo">
              ${p2.complexity.flow.map((fl, i, arr) => `
              <div class="cs-evo-step">${fl}</div>
              ${i < arr.length - 1 ? `<div class="cs-evo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>` : ''}
              `).join('')}
            </div>
          </div>
          <div>
            <h4>Supporting Technologies</h4>
            <p class="lead">A wider stack of connected and computational technologies sits alongside this flow.</p>
            <div class="tag-row" style="margin-top:22px;">
              ${p2.complexity.supporting.map(sp => `<span class="tag">${sp}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: PEOPLE & ORGANIZATION -->
    <section class="cs-sec" id="i4-people">
      <div class="wrap">
        <span class="section-label">${p2.people.sectionLabel}</span>
        <h2 class="cs-h2">${p2.people.heading}</h2>
        <p class="cs-intro">${p2.people.intro}</p>

        <div class="cs-evo" style="margin-top:36px; max-width:60ch;">
          ${p2.people.steps.map((st, i, arr) => `
          <div class="cs-evo-step">${st}</div>
          ${i < arr.length - 1 ? `<div class="cs-evo-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>` : ''}
          `).join('')}
        </div>

        <div class="tag-row" style="margin-top:28px;">
          ${p2.people.tags.map(tg => `<span class="tag">${tg}</span>`).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 6: TECHNOLOGY STACK -->
    <section class="cs-sec" id="i4-stack">
      <div class="wrap">
        <span class="section-label">${p2.techStack.sectionLabel}</span>
        <h2 class="cs-h2">${p2.techStack.heading}</h2>
        <p class="cs-intro">${p2.techStack.intro}</p>

        <div class="cs-sdg-grid" style="grid-template-columns:repeat(3,1fr);">
          ${p2.techStack.categories.map(cat => `
          <div class="cs-sdg-card" tabindex="0">
            <span class="cs-sdg-tag">${cat.tag}</span>
            <h4>${cat.title}</h4>
            <ul class="cs-sdg-list">
              ${cat.list.map(li => `<li>${li}</li>`).join('')}
            </ul>
            <p class="cs-sdg-note">${cat.note}</p>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 7: THEORETICAL FRAMEWORKS -->
    <section class="cs-sec" id="i4-framework">
      <div class="wrap">
        <span class="section-label">${p2.frameworks.sectionLabel}</span>
        <h2 class="cs-h2">${p2.frameworks.heading}</h2>
        <p class="cs-intro">${p2.frameworks.intro}</p>

        <div class="cs-fw-list">
          ${p2.frameworks.list.map(fw => `
          <div class="cs-fw-item">
            <span class="cs-fw-dot"></span>
            <button type="button" class="cs-fw-btn">
              <span class="t">${fw.title}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="cs-fw-body"><p>${fw.desc}</p></div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 8: RESEARCH HYPOTHESIS -->
    <section class="cs-sec" id="i4-hypothesis">
      <div class="wrap">
        <span class="section-label">${p2.hypothesis.sectionLabel}</span>
        <h2 class="cs-h2">${p2.hypothesis.heading}</h2>
        <p class="cs-intro">${p2.hypothesis.intro}</p>

        <div class="cs-net" style="margin-top:36px;">
          <div class="cs-net-row"><span class="cs-net-node">${p2.hypothesis.source}</span></div>
          <div class="cs-net-down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg></div>
          <div class="cs-net-row">
            ${p2.hypothesis.targets.map(tg => `<span class="cs-net-node">${tg}</span>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 9: POTENTIAL BENEFITS -->
    <section class="cs-sec" id="i4-benefits">
      <div class="wrap">
        <span class="section-label">${p2.benefits.sectionLabel}</span>
        <h2 class="cs-h2">${p2.benefits.heading}</h2>
        <p class="cs-intro">${p2.benefits.intro}</p>

        <div class="cs-challenge-row" style="grid-template-columns:repeat(5,1fr);">
          ${p2.benefits.items.map(b => `
          <div class="cs-challenge">
            <div class="cs-challenge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v10M12 21a1.4 1.4 0 1 0 0-2.8A1.4 1.4 0 0 0 12 21z" stroke-linecap="round"/></svg></div>
            <p>${b}</p>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 10: REMEDIES / ROADMAP -->
    <section class="cs-sec" id="i4-roadmap">
      <div class="wrap">
        <span class="section-label">${p2.roadmap.sectionLabel}</span>
        <h2 class="cs-h2">${p2.roadmap.heading}</h2>
        <p class="cs-intro">${p2.roadmap.intro}</p>

        <div class="i4-rm-list">
          ${p2.roadmap.steps.map((step, idx) => `
          <div class="i4-rm-item"><span class="i4-rm-dot"></span><div class="num">${idx < 9 ? '0' : ''}${idx + 1}</div><div class="t">${step}</div></div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 11: CRITICAL SUCCESS AREAS -->
    <section class="cs-sec" id="i4-success">
      <div class="wrap">
        <span class="section-label">${p2.pillars.sectionLabel}</span>
        <h2 class="cs-h2">${p2.pillars.heading}</h2>

        <div class="cs-roadmap cs-roadmap--5">
          ${p2.pillars.pillars.map(pillar => `
          <div class="cs-pillar">
            <span class="cs-pillar-num">${pillar.num}</span>
            <h4>${pillar.title}</h4>
            <ul>
              ${pillar.items.map(it => `<li>${it}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION 12: RESEARCH INSIGHT -->
    <section class="cs-sec" id="i4-insight">
      <div class="wrap">
        <span class="section-label">${p2.insight.sectionLabel}</span>
        <h2 class="cs-h2">${p2.insight.heading}</h2>
        <p class="cs-intro">${p2.insight.intro}</p>

        <div class="i4-eq-light">
          ${p2.insight.equation.map(item => `<span class="item">${item}</span><span class="op">+</span>`).join('')}
          <span class="item result">${p2.insight.result}</span>
        </div>
      </div>
    </section>

    <!-- SECTION 13: FINAL TAKEAWAY -->
    <section class="cs-sec cs-final" id="i4-final">
      <div class="wrap cs-final-inner">
        <h3>${p2.takeaway.heading}</h3>
        <p>${p2.takeaway.text}</p>
        <div class="cs-equation">
          ${p2.takeaway.equation.map(eq => `
          <span class="${eq.type === 'op' ? 'eq-op' : eq.type === 'result' ? 'eq-item eq-result' : 'eq-item'}">${eq.text}</span>
          `).join('')}
        </div>
      </div>
    </section>
  </div>`;
    }
  }
}
