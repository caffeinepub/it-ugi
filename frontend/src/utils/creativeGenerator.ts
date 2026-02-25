export type Platform = 'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'meta_ads' | 'google_video';
export type FunnelStage = 'cold' | 'warm' | 'hot';
export type ToneMode = 'aggressive' | 'soft' | 'authority' | 'luxury';

export interface FormInputs {
  productName: string;
  description: string;
  platforms: Platform[];
  funnelStage: FunnelStage;
  toneMode: ToneMode;
  competitorInfo?: string;
}

export interface AudiencePersona {
  painPoints: string[];
  desires: string[];
  objections: string[];
  targetSegments: string[];
}

export interface HookVariation {
  type: string;
  hook: string;
  pattern: string;
}

export interface Scripts {
  thirtySecond: string;
  fifteenSecond: string;
  sixSecond: string;
  youtubeOutline: {
    intro: string;
    body: string[];
    cta: string;
  };
}

export interface MetaAdsCopy {
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
  ctaButton: string;
}

export interface GoogleAdsCopy {
  shortHeadlines: Array<{ text: string; charCount: number }>;
  longHeadlines: string[];
  descriptions: string[];
  fiveSecondHook: string;
}

export interface ShotSection {
  cameraAngle: string;
  bRoll: string;
  expressionCue: string;
}

export interface ShotBreakdown {
  hook: ShotSection;
  body: ShotSection;
  cta: ShotSection;
  onScreenText: string[];
  thumbnailIdeas: string[];
}

export interface CreativePackageData {
  persona: AudiencePersona;
  hooks: HookVariation[];
  scripts: Scripts;
  metaAds: MetaAdsCopy;
  googleAds: GoogleAdsCopy;
  shotBreakdown: ShotBreakdown;
  ctaVariations: string[];
}

// ─── Tone helpers ────────────────────────────────────────────────────────────

function toneOpener(tone: ToneMode, productName: string): string {
  switch (tone) {
    case 'aggressive':
      return `Stop wasting money on ${productName} that doesn't work.`;
    case 'soft':
      return `What if getting results with ${productName} was actually easy?`;
    case 'authority':
      return `After helping thousands of customers, here's what we know about ${productName}.`;
    case 'luxury':
      return `Discover the ${productName} experience that redefines excellence.`;
  }
}

function toneUrgency(tone: ToneMode): string {
  switch (tone) {
    case 'aggressive':
      return 'Act NOW — this offer expires soon and spots are limited.';
    case 'soft':
      return 'Join thousands who already made the switch — before it\'s too late.';
    case 'authority':
      return 'Trusted by industry leaders. Limited availability for new clients.';
    case 'luxury':
      return 'Exclusively available to a select few. Reserve your place today.';
  }
}

function funnelCTA(stage: FunnelStage, tone: ToneMode): string {
  if (stage === 'cold') {
    if (tone === 'aggressive') return 'Learn More Now';
    if (tone === 'soft') return 'See How It Works';
    if (tone === 'authority') return 'Discover the Method';
    return 'Explore the Experience';
  }
  if (stage === 'warm') {
    if (tone === 'aggressive') return 'Claim Your Discount';
    if (tone === 'soft') return 'Get Started Today';
    if (tone === 'authority') return 'Book a Consultation';
    return 'Request Exclusive Access';
  }
  // hot
  if (tone === 'aggressive') return 'Buy Now — Limited Stock';
  if (tone === 'soft') return 'Start Your Journey';
  if (tone === 'authority') return 'Get Instant Access';
  return 'Secure Your Order';
}

function funnelContext(stage: FunnelStage): string {
  switch (stage) {
    case 'cold': return 'You might not know this yet, but';
    case 'warm': return 'You\'ve seen what we can do — now';
    case 'hot': return 'You\'re ready to transform your results —';
  }
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateCreativePackage(inputs: FormInputs): CreativePackageData {
  const { productName, description, funnelStage, toneMode, competitorInfo } = inputs;
  const pn = productName;
  const desc = description;

  // ── Audience Persona ──────────────────────────────────────────────────────
  const persona: AudiencePersona = {
    targetSegments: [
      `Primary buyers actively searching for ${pn} solutions`,
      `People frustrated with current alternatives in the market`,
      `Early adopters and trend-conscious consumers aged 25–44`,
    ],
    painPoints: [
      `Wasting time and money on solutions that don't deliver real results`,
      `Feeling overwhelmed by too many options with no clear winner`,
      `Struggling to see measurable progress despite consistent effort`,
      `Lack of trust in brands that overpromise and underdeliver`,
    ],
    desires: [
      `A proven, reliable solution that actually works as advertised`,
      `Fast, visible results without complicated processes`,
      `Confidence and peace of mind knowing they made the right choice`,
      `To be seen as smart, ahead of the curve, and successful`,
    ],
    objections: [
      `"I've tried similar products before and they didn't work for me."`,
      `"It seems too expensive compared to other options."`,
      competitorInfo
        ? `"I've heard ${competitorInfo} is just as good — why should I switch?"`
        : `"I'm not sure this is different from what's already out there."`,
    ],
  };

  // ── Hook Variations ───────────────────────────────────────────────────────
  const hooks: HookVariation[] = [
    {
      type: 'Pattern Interrupt',
      pattern: 'Unexpected visual or statement that breaks scroll behavior',
      hook: `Wait — before you scroll past this, you need to hear what ${pn} just did for me.`,
    },
    {
      type: 'Bold Claim',
      pattern: 'Make a specific, surprising promise upfront',
      hook: `I went from zero to results in 7 days using ${pn} — and I have proof.`,
    },
    {
      type: 'Pain Point Question',
      pattern: 'Ask a question that mirrors the audience\'s frustration',
      hook: `Tired of spending money on things that just don't work? Same. Until I found ${pn}.`,
    },
    {
      type: 'FOMO Trigger',
      pattern: 'Create urgency by showing what others are already experiencing',
      hook: `Everyone is switching to ${pn} right now — and here's exactly why you should too.`,
    },
    {
      type: 'Authority Proof',
      pattern: 'Lead with credibility and social proof numbers',
      hook: `Over 10,000 people have already transformed their results with ${pn}. Here's their story.`,
    },
    {
      type: 'Curiosity Gap',
      pattern: 'Tease information without revealing it fully',
      hook: `There's one thing nobody tells you about ${pn} — and it changes everything.`,
    },
  ];

  // ── Scripts ───────────────────────────────────────────────────────────────
  const opener = toneOpener(toneMode, pn);
  const urgency = toneUrgency(toneMode);
  const cta = funnelCTA(funnelStage, toneMode);
  const context = funnelContext(funnelStage);

  const thirtySecond = `[HOOK — 0–3s]
${opener}

[PROBLEM — 3–10s]
${context} most people dealing with this are stuck in the same cycle — trying everything, getting nowhere. Sound familiar?

[SOLUTION — 10–20s]
That's exactly why ${pn} exists. ${desc.slice(0, 120)}${desc.length > 120 ? '...' : ''} It's designed to give you real results, fast — without the guesswork.

[SOCIAL PROOF — 20–25s]
Thousands of people just like you have already made the switch. The results speak for themselves.

[CTA — 25–30s]
${urgency} Tap the link below. ${cta}.`;

  const fifteenSecond = `[HOOK — 0–3s]
${opener}

[SOLUTION — 3–10s]
${pn} is the answer. ${desc.slice(0, 80)}${desc.length > 80 ? '...' : ''} Real results, proven by thousands.

[CTA — 10–15s]
${urgency} ${cta} — link in bio.`;

  const sixSecond = `${opener} ${pn} changes everything. ${cta} now.`;

  const youtubeOutline = {
    intro: `[0:00–0:30] HOOK & PATTERN INTERRUPT
Open with: "${opener}"
Immediately address the viewer's pain: "If you've been struggling with [problem], this video is going to change how you think about it."
Tease the payoff: "By the end of this, you'll know exactly how to get [desired result] using ${pn}."`,
    body: [
      `[0:30–2:00] THE PROBLEM DEEP DIVE
Walk through the core pain points your audience faces.
Use relatable storytelling: "I used to think [common misconception]..."
Build empathy and establish authority.
Reference competitor shortfalls if applicable.`,
      `[2:00–5:00] THE SOLUTION — ${pn.toUpperCase()}
Introduce ${pn} as the definitive answer.
Break down key features as benefits: "What this means for YOU is..."
Show before/after or demonstration.
Stack benefits using the AIDA framework.`,
      `[5:00–7:00] SOCIAL PROOF & RESULTS
Share real testimonials or case studies.
Use specific numbers: "In just X days, customers saw Y result."
Address the top 2 objections directly.
Build trust with transparency.`,
      `[7:00–8:30] OBJECTION HANDLING
"You might be thinking: [objection 1]" — here's the truth.
"And if you're worried about [objection 2]" — here's why that's not an issue.
Reinforce value proposition.`,
    ],
    cta: `[8:30–9:00] STRONG CTA
"Here's what I want you to do right now:"
${cta} — link in the description below.
"If you found this helpful, smash that like button and subscribe for more."
${urgency}`,
  };

  // ── Meta Ads Copy ─────────────────────────────────────────────────────────
  const metaAds: MetaAdsCopy = {
    primaryTexts: [
      `🔥 ${opener}\n\n${desc.slice(0, 100)}${desc.length > 100 ? '...' : ''}\n\nJoin thousands of people who've already made the switch to ${pn}. The results are real, the process is simple, and the time to act is NOW.\n\n👇 ${cta}`,
      `${context} there's a smarter way to get the results you've been chasing.\n\n${pn} was built for people who are done settling for "good enough." Here's what makes it different:\n✅ Proven results backed by real customers\n✅ Simple to use from day one\n✅ Designed to deliver fast, visible outcomes\n\n${urgency}\n\n👉 ${cta}`,
      `"I wish I'd found this sooner." — That's what our customers keep telling us.\n\n${pn} has helped thousands of people finally crack the code on [their goal]. ${desc.slice(0, 80)}${desc.length > 80 ? '...' : ''}\n\nDon't be the last one to find out. ${cta} today.`,
    ],
    headlines: [
      `${pn}: Results That Actually Work`,
      `Stop Guessing. Start Getting Results.`,
      `Join 10,000+ Happy ${pn} Users`,
    ],
    descriptions: [
      `${desc.slice(0, 90)}${desc.length > 90 ? '...' : ''} Proven results. Real customers. ${cta}.`,
      `Tired of solutions that don't deliver? ${pn} is different. See why thousands trust us.`,
      `${urgency} Limited time offer. ${cta} and transform your results today.`,
    ],
    ctaButton: funnelStage === 'hot' ? 'Shop Now' : funnelStage === 'warm' ? 'Get Offer' : 'Learn More',
  };

  // ── Google Video Ads Copy ─────────────────────────────────────────────────
  const shortHeadlineTexts = [
    `Try ${pn} Today`,
    `Real Results Fast`,
    `Join Thousands Now`,
    `${pn} — It Works`,
    `Limited Offer Inside`,
  ].map(t => t.slice(0, 30));

  const googleAds: GoogleAdsCopy = {
    shortHeadlines: shortHeadlineTexts.map(text => ({
      text,
      charCount: text.length,
    })),
    longHeadlines: [
      `Discover Why ${pn} Is the #1 Choice for Real Results`,
      `Stop Wasting Time — ${pn} Delivers What Others Promise`,
      `Join Over 10,000 People Who Transformed Their Results with ${pn}`,
      `The Smarter Way to Get Results: Introducing ${pn}`,
      `${pn}: Proven, Fast, and Built for People Who Demand More`,
    ],
    descriptions: [
      `${desc.slice(0, 90)}${desc.length > 90 ? '...' : ''} Thousands of satisfied customers. ${cta} today.`,
      `Tired of products that overpromise? ${pn} delivers real, measurable results from day one. ${urgency}`,
      `Join the movement. ${pn} has helped thousands achieve their goals faster than they thought possible. ${cta}.`,
      `Don't miss out — ${pn} is the solution you've been searching for. Proven results, simple process, real impact.`,
    ],
    fiveSecondHook: `${opener} [SKIP THIS and miss out on ${pn}.]`,
  };

  // ── Shot Breakdown ────────────────────────────────────────────────────────
  const shotBreakdown: ShotBreakdown = {
    hook: {
      cameraAngle: 'Close-up selfie angle, slightly below eye level — creates intimacy and urgency. Handheld, slight shake for authenticity.',
      bRoll: 'Quick cut to the problem being experienced (e.g., frustrated person, messy desk, failed attempt). 1–2 second flash cuts.',
      expressionCue: 'Surprised or concerned expression. Wide eyes, leaning slightly toward camera. Speak with urgency — like you\'re sharing a secret.',
    },
    body: {
      cameraAngle: 'Medium shot, waist-up. Natural lighting (window light preferred). Slight movement — walk and talk or gesture naturally.',
      bRoll: `Product in use, close-up of key features, before/after visuals, screen recordings of results, happy customer reactions.`,
      expressionCue: 'Confident, enthusiastic, nodding. Use hand gestures to emphasize key points. Smile when mentioning results.',
    },
    cta: {
      cameraAngle: 'Return to close-up selfie angle. Direct eye contact with camera. Point toward screen or gesture to link.',
      bRoll: 'Product packaging or app screen, order confirmation, happy customer using product.',
      expressionCue: 'High energy, direct, urgent. Lean in slightly. Speak faster with conviction. End with a genuine smile.',
    },
    onScreenText: [
      `"${pn.toUpperCase()}" — bold text, center screen, first 2 seconds`,
      `"WAIT 🛑" — pattern interrupt text overlay at hook`,
      `"✅ PROVEN RESULTS" — appears during social proof section`,
      `"⚡ LIMITED TIME" — flashing text during CTA`,
      `"LINK IN BIO 👇" — persistent lower-third during CTA`,
      `"10,000+ HAPPY CUSTOMERS" — social proof overlay`,
    ],
    thumbnailIdeas: [
      `BEFORE vs AFTER split image with bold text: "This Changed Everything"`,
      `Close-up shocked face with text overlay: "${pn.toUpperCase()} — WHY DIDN'T I KNOW THIS SOONER?"`,
      `Product hero shot with bold text: "The #1 ${pn} Secret Nobody Talks About"`,
      `Results screenshot/graphic with text: "10,000 People Can't Be Wrong"`,
    ],
  };

  // ── CTA Variations ────────────────────────────────────────────────────────
  const ctaVariations = [
    `${cta} — tap the link below before this offer disappears.`,
    `Don't wait. Click the link and ${cta.toLowerCase()} right now.`,
    `Your results are one click away. ${cta} today.`,
    `Join thousands who already made the smart choice. ${cta}.`,
    `The only thing standing between you and results is one click. ${cta}.`,
  ];

  return {
    persona,
    hooks,
    scripts: { thirtySecond, fifteenSecond, sixSecond, youtubeOutline },
    metaAds,
    googleAds,
    shotBreakdown,
    ctaVariations,
  };
}

// ─── Serialization helpers for backend storage ────────────────────────────────

export function serializePackageToAssets(
  data: CreativePackageData,
  inputs: FormInputs,
  packageId: string
) {
  const scriptAssets = [
    { id: `${packageId}_script_30s`, name: '30-Second Script', content: data.scripts.thirtySecond, assetType: 'script' },
    { id: `${packageId}_script_15s`, name: '15-Second Script', content: data.scripts.fifteenSecond, assetType: 'script' },
    { id: `${packageId}_script_6s`, name: '6-Second Bumper', content: data.scripts.sixSecond, assetType: 'script' },
    { id: `${packageId}_script_yt`, name: 'YouTube Outline', content: JSON.stringify(data.scripts.youtubeOutline), assetType: 'script' },
    { id: `${packageId}_hooks`, name: 'Hook Variations', content: JSON.stringify(data.hooks), assetType: 'script' },
    { id: `${packageId}_ctas`, name: 'CTA Variations', content: JSON.stringify(data.ctaVariations), assetType: 'script' },
  ];

  const copyAssets = [
    { id: `${packageId}_meta`, name: 'Meta Ads Copy', content: JSON.stringify(data.metaAds), assetType: 'copy' },
    { id: `${packageId}_google`, name: 'Google Video Ads Copy', content: JSON.stringify(data.googleAds), assetType: 'copy' },
  ];

  const personaAssets = [
    { id: `${packageId}_persona`, name: 'Audience Persona', content: JSON.stringify(data.persona), assetType: 'persona' },
  ];

  const shotAssets = [
    { id: `${packageId}_shots`, name: 'Shot Breakdown', content: JSON.stringify(data.shotBreakdown), assetType: 'shot' },
  ];

  return { scriptAssets, copyAssets, personaAssets, shotAssets };
}

export function deserializePackageFromAssets(
  scriptAssets: Array<{ id: string; name: string; content: string; assetType: string }>,
  copyAssets: Array<{ id: string; name: string; content: string; assetType: string }>,
  personaAssets: Array<{ id: string; name: string; content: string; assetType: string }>,
  shotAssets: Array<{ id: string; name: string; content: string; assetType: string }>,
  productName: string,
  description: string,
  funnelStage: string,
  tone: string
): { data: CreativePackageData; inputs: FormInputs } | null {
  try {
    const thirtyS = scriptAssets.find(a => a.name === '30-Second Script')?.content ?? '';
    const fifteenS = scriptAssets.find(a => a.name === '15-Second Script')?.content ?? '';
    const sixS = scriptAssets.find(a => a.name === '6-Second Bumper')?.content ?? '';
    const ytRaw = scriptAssets.find(a => a.name === 'YouTube Outline')?.content ?? '{}';
    const hooksRaw = scriptAssets.find(a => a.name === 'Hook Variations')?.content ?? '[]';
    const ctasRaw = scriptAssets.find(a => a.name === 'CTA Variations')?.content ?? '[]';
    const metaRaw = copyAssets.find(a => a.name === 'Meta Ads Copy')?.content ?? '{}';
    const googleRaw = copyAssets.find(a => a.name === 'Google Video Ads Copy')?.content ?? '{}';
    const personaRaw = personaAssets.find(a => a.name === 'Audience Persona')?.content ?? '{}';
    const shotsRaw = shotAssets.find(a => a.name === 'Shot Breakdown')?.content ?? '{}';

    const data: CreativePackageData = {
      persona: JSON.parse(personaRaw),
      hooks: JSON.parse(hooksRaw),
      scripts: {
        thirtySecond: thirtyS,
        fifteenSecond: fifteenS,
        sixSecond: sixS,
        youtubeOutline: JSON.parse(ytRaw),
      },
      metaAds: JSON.parse(metaRaw),
      googleAds: JSON.parse(googleRaw),
      shotBreakdown: JSON.parse(shotsRaw),
      ctaVariations: JSON.parse(ctasRaw),
    };

    const inputs: FormInputs = {
      productName,
      description,
      platforms: ['youtube', 'instagram', 'facebook', 'tiktok', 'meta_ads', 'google_video'],
      funnelStage: funnelStage as FunnelStage,
      toneMode: tone as ToneMode,
    };

    return { data, inputs };
  } catch {
    return null;
  }
}
