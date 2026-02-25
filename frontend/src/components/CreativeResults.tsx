import { useState } from 'react';
import { toast } from 'sonner';
import {
  Copy, Check, Save, PlusCircle, History, ChevronDown, ChevronUp,
  Zap, Users, Film, Megaphone, Search, Camera, Target, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSaveCreativePackage } from '../hooks/useQueries';
import { serializePackageToAssets, type CreativePackageData, type FormInputs } from '../utils/creativeGenerator';

interface CreativeResultsProps {
  data: CreativePackageData;
  inputs: FormInputs;
  onNewCreative: () => void;
  onViewHistory: () => void;
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 text-xs text-muted-foreground hover:text-brand h-7 px-2"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
}

function SectionHeader({ icon: Icon, title, copyText }: { icon: React.ElementType; title: string; copyText: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-brand/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand" />
        </div>
        <h3 className="font-display font-bold text-base text-foreground">{title}</h3>
      </div>
      <CopyButton text={copyText} />
    </div>
  );
}

function ContentBlock({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-2 rounded-lg p-4 border border-border/40 ${className}`}>
      {children}
    </div>
  );
}

export default function CreativeResults({ data, inputs, onNewCreative, onViewHistory }: CreativeResultsProps) {
  const saveMutation = useSaveCreativePackage();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const packageId = `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const { scriptAssets, copyAssets, personaAssets, shotAssets } = serializePackageToAssets(data, inputs, packageId);

    try {
      await saveMutation.mutateAsync({
        id: packageId,
        productName: inputs.productName,
        description: inputs.description,
        funnelStage: inputs.funnelStage,
        tone: inputs.toneMode,
        scriptAssets,
        copyAssets,
        personaAssets,
        shotAssets,
      });
      setSaved(true);
      toast.success('Creative package saved!');
    } catch {
      toast.error('Failed to save package');
    }
  };

  const buildFullText = (): string => {
    const lines: string[] = [];
    lines.push(`=== UGC CREATIVE PACKAGE: ${inputs.productName.toUpperCase()} ===`);
    lines.push(`Funnel Stage: ${inputs.funnelStage} | Tone: ${inputs.toneMode}`);
    lines.push('');

    lines.push('--- AUDIENCE PERSONA ---');
    lines.push('Pain Points:');
    data.persona.painPoints.forEach(p => lines.push(`  • ${p}`));
    lines.push('Desires:');
    data.persona.desires.forEach(d => lines.push(`  • ${d}`));
    lines.push('Objections:');
    data.persona.objections.forEach(o => lines.push(`  • ${o}`));
    lines.push('');

    lines.push('--- HOOK VARIATIONS ---');
    data.hooks.forEach((h, i) => {
      lines.push(`${i + 1}. [${h.type}] ${h.hook}`);
    });
    lines.push('');

    lines.push('--- 30-SECOND SCRIPT ---');
    lines.push(data.scripts.thirtySecond);
    lines.push('');

    lines.push('--- 15-SECOND SCRIPT ---');
    lines.push(data.scripts.fifteenSecond);
    lines.push('');

    lines.push('--- 6-SECOND BUMPER ---');
    lines.push(data.scripts.sixSecond);
    lines.push('');

    lines.push('--- META ADS COPY ---');
    data.metaAds.primaryTexts.forEach((t, i) => lines.push(`Primary Text ${i + 1}:\n${t}\n`));
    lines.push('Headlines:');
    data.metaAds.headlines.forEach(h => lines.push(`  • ${h}`));
    lines.push('Descriptions:');
    data.metaAds.descriptions.forEach(d => lines.push(`  • ${d}`));
    lines.push(`CTA Button: ${data.metaAds.ctaButton}`);
    lines.push('');

    lines.push('--- GOOGLE VIDEO ADS ---');
    lines.push('Short Headlines:');
    data.googleAds.shortHeadlines.forEach(h => lines.push(`  • ${h.text} (${h.charCount} chars)`));
    lines.push('Long Headlines:');
    data.googleAds.longHeadlines.forEach(h => lines.push(`  • ${h}`));
    lines.push('Descriptions:');
    data.googleAds.descriptions.forEach(d => lines.push(`  • ${d}`));
    lines.push(`5-Second Hook: ${data.googleAds.fiveSecondHook}`);
    lines.push('');

    lines.push('--- SHOT BREAKDOWN ---');
    lines.push('HOOK SHOT:');
    lines.push(`  Camera: ${data.shotBreakdown.hook.cameraAngle}`);
    lines.push(`  B-Roll: ${data.shotBreakdown.hook.bRoll}`);
    lines.push(`  Expression: ${data.shotBreakdown.hook.expressionCue}`);
    lines.push('BODY SHOT:');
    lines.push(`  Camera: ${data.shotBreakdown.body.cameraAngle}`);
    lines.push(`  B-Roll: ${data.shotBreakdown.body.bRoll}`);
    lines.push(`  Expression: ${data.shotBreakdown.body.expressionCue}`);
    lines.push('CTA SHOT:');
    lines.push(`  Camera: ${data.shotBreakdown.cta.cameraAngle}`);
    lines.push(`  B-Roll: ${data.shotBreakdown.cta.bRoll}`);
    lines.push(`  Expression: ${data.shotBreakdown.cta.expressionCue}`);
    lines.push('');
    lines.push('On-Screen Text:');
    data.shotBreakdown.onScreenText.forEach(t => lines.push(`  • ${t}`));
    lines.push('Thumbnail Ideas:');
    data.shotBreakdown.thumbnailIdeas.forEach(t => lines.push(`  • ${t}`));

    return lines.join('\n');
  };

  const toneLabels: Record<string, string> = {
    aggressive: 'Aggressive Hard Sell',
    soft: 'Soft Persuasive',
    authority: 'Authority-Driven',
    luxury: 'Luxury Positioning',
  };

  const funnelLabels: Record<string, string> = {
    cold: 'Cold Audience',
    warm: 'Warm Retargeting',
    hot: 'Hot Conversion',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-foreground">
            Creative Package: <span className="text-brand">{inputs.productName}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge className="badge-brand">{funnelLabels[inputs.funnelStage]}</Badge>
            <Badge variant="outline" className="border-border/50 text-muted-foreground text-xs">
              {toneLabels[inputs.toneMode]}
            </Badge>
            <Badge variant="outline" className="border-border/50 text-muted-foreground text-xs">
              {inputs.platforms.length} platforms
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyButton text={buildFullText()} label="Copy All" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending || saved}
            className="gap-2 border-border/50 text-sm"
          >
            {saveMutation.isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saved ? 'Saved!' : 'Save Package'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onViewHistory} className="gap-2 text-muted-foreground">
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </Button>
          <Button size="sm" onClick={onNewCreative} className="btn-brand gap-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="persona" className="w-full">
        <TabsList className="tabs-list grid grid-cols-3 sm:grid-cols-6 h-auto gap-1 p-1">
          <TabsTrigger value="persona" className="tab-trigger text-xs py-2">
            <Users className="w-3.5 h-3.5 mr-1" />Persona
          </TabsTrigger>
          <TabsTrigger value="hooks" className="tab-trigger text-xs py-2">
            <Zap className="w-3.5 h-3.5 mr-1" />Hooks
          </TabsTrigger>
          <TabsTrigger value="scripts" className="tab-trigger text-xs py-2">
            <Film className="w-3.5 h-3.5 mr-1" />Scripts
          </TabsTrigger>
          <TabsTrigger value="meta" className="tab-trigger text-xs py-2">
            <Megaphone className="w-3.5 h-3.5 mr-1" />Meta
          </TabsTrigger>
          <TabsTrigger value="google" className="tab-trigger text-xs py-2">
            <Search className="w-3.5 h-3.5 mr-1" />Google
          </TabsTrigger>
          <TabsTrigger value="shots" className="tab-trigger text-xs py-2">
            <Camera className="w-3.5 h-3.5 mr-1" />Shots
          </TabsTrigger>
        </TabsList>

        {/* ── Persona Tab ── */}
        <TabsContent value="persona" className="mt-4 space-y-4">
          <div className="card-panel">
            <SectionHeader
              icon={Users}
              title="Audience Persona"
              copyText={[
                'PAIN POINTS:\n' + data.persona.painPoints.map(p => `• ${p}`).join('\n'),
                'DESIRES:\n' + data.persona.desires.map(d => `• ${d}`).join('\n'),
                'OBJECTIONS:\n' + data.persona.objections.map(o => `• ${o}`).join('\n'),
              ].join('\n\n')}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <ContentBlock>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">😤 Pain Points</h4>
                <ul className="space-y-2">
                  {data.persona.painPoints.map((p, i) => (
                    <li key={i} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-brand mt-0.5 flex-shrink-0">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </ContentBlock>

              <ContentBlock>
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">✨ Desires</h4>
                <ul className="space-y-2">
                  {data.persona.desires.map((d, i) => (
                    <li key={i} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </ContentBlock>

              <ContentBlock>
                <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3">🛡 Objections</h4>
                <ul className="space-y-2">
                  {data.persona.objections.map((o, i) => (
                    <li key={i} className="text-sm text-foreground/90 flex gap-2">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </ContentBlock>
            </div>

            <ContentBlock className="mt-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">🎯 Target Segments</h4>
              <ul className="space-y-2">
                {data.persona.targetSegments.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/90 flex gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </ContentBlock>
          </div>
        </TabsContent>

        {/* ── Hooks Tab ── */}
        <TabsContent value="hooks" className="mt-4">
          <div className="card-panel">
            <SectionHeader
              icon={Zap}
              title="Hook Variations"
              copyText={data.hooks.map((h, i) => `${i + 1}. [${h.type}]\n${h.hook}\nPattern: ${h.pattern}`).join('\n\n')}
            />
            <div className="space-y-3">
              {data.hooks.map((hook, i) => (
                <ContentBlock key={i}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-brand/20 text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <Badge className="badge-brand text-xs">{hook.type}</Badge>
                      </div>
                      <p className="text-foreground font-medium text-sm leading-relaxed mb-2">"{hook.hook}"</p>
                      <p className="text-xs text-muted-foreground italic">Pattern: {hook.pattern}</p>
                    </div>
                    <CopyButton text={hook.hook} />
                  </div>
                </ContentBlock>
              ))}
            </div>

            {/* CTA Variations */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> CTA Variations
                </h4>
                <CopyButton text={data.ctaVariations.join('\n')} />
              </div>
              <div className="space-y-2">
                {data.ctaVariations.map((cta, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-surface-2 rounded-lg px-4 py-2.5 border border-border/40">
                    <p className="text-sm text-foreground/90">{cta}</p>
                    <CopyButton text={cta} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Scripts Tab ── */}
        <TabsContent value="scripts" className="mt-4">
          <div className="card-panel">
            <SectionHeader
              icon={Film}
              title="Video Scripts"
              copyText={`30-SEC:\n${data.scripts.thirtySecond}\n\n15-SEC:\n${data.scripts.fifteenSecond}\n\n6-SEC:\n${data.scripts.sixSecond}`}
            />

            <Accordion type="multiple" defaultValue={['30s']} className="space-y-3">
              <AccordionItem value="30s" className="accordion-item">
                <AccordionTrigger className="accordion-trigger">
                  <div className="flex items-center gap-2">
                    <Badge className="badge-brand">30 sec</Badge>
                    <span className="text-sm font-semibold">Full UGC Ad Script</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <div className="flex justify-end mb-2">
                    <CopyButton text={data.scripts.thirtySecond} />
                  </div>
                  <pre className="script-block">{data.scripts.thirtySecond}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="15s" className="accordion-item">
                <AccordionTrigger className="accordion-trigger">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border/50 text-xs">15 sec</Badge>
                    <span className="text-sm font-semibold">Short Cutdown</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <div className="flex justify-end mb-2">
                    <CopyButton text={data.scripts.fifteenSecond} />
                  </div>
                  <pre className="script-block">{data.scripts.fifteenSecond}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="6s" className="accordion-item">
                <AccordionTrigger className="accordion-trigger">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border/50 text-xs">6 sec</Badge>
                    <span className="text-sm font-semibold">Bumper Hook</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <div className="flex justify-end mb-2">
                    <CopyButton text={data.scripts.sixSecond} />
                  </div>
                  <pre className="script-block">{data.scripts.sixSecond}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="youtube" className="accordion-item">
                <AccordionTrigger className="accordion-trigger">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-border/50 text-xs">Long-form</Badge>
                    <span className="text-sm font-semibold">YouTube Script Outline</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <div className="flex justify-end mb-2">
                    <CopyButton text={[
                      data.scripts.youtubeOutline.intro,
                      ...data.scripts.youtubeOutline.body,
                      data.scripts.youtubeOutline.cta
                    ].join('\n\n')} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-brand uppercase tracking-wider mb-2">Intro</h5>
                      <pre className="script-block">{data.scripts.youtubeOutline.intro}</pre>
                    </div>
                    {data.scripts.youtubeOutline.body.map((section, i) => (
                      <div key={i}>
                        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          Body Section {i + 1}
                        </h5>
                        <pre className="script-block">{section}</pre>
                      </div>
                    ))}
                    <div>
                      <h5 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">CTA</h5>
                      <pre className="script-block">{data.scripts.youtubeOutline.cta}</pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>

        {/* ── Meta Ads Tab ── */}
        <TabsContent value="meta" className="mt-4">
          <div className="card-panel">
            <SectionHeader
              icon={Megaphone}
              title="Meta Ads Copy"
              copyText={[
                'PRIMARY TEXTS:\n' + data.metaAds.primaryTexts.map((t, i) => `[${i + 1}]\n${t}`).join('\n\n'),
                'HEADLINES:\n' + data.metaAds.headlines.map(h => `• ${h}`).join('\n'),
                'DESCRIPTIONS:\n' + data.metaAds.descriptions.map(d => `• ${d}`).join('\n'),
                `CTA BUTTON: ${data.metaAds.ctaButton}`,
              ].join('\n\n')}
            />

            <div className="space-y-5">
              {/* Primary Texts */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Primary Text Variations</h4>
                <div className="space-y-3">
                  {data.metaAds.primaryTexts.map((text, i) => (
                    <ContentBlock key={i}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <Badge className="badge-brand text-xs mb-2">Variation {i + 1}</Badge>
                          <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{text}</p>
                        </div>
                        <CopyButton text={text} />
                      </div>
                    </ContentBlock>
                  ))}
                </div>
              </div>

              {/* Headlines */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Headlines</h4>
                <div className="space-y-2">
                  {data.metaAds.headlines.map((h, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <p className="text-sm font-semibold text-foreground">{h}</p>
                      </div>
                      <CopyButton text={h} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Descriptions</h4>
                <div className="space-y-2">
                  {data.metaAds.descriptions.map((d, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground w-4 mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-foreground/90">{d}</p>
                      </div>
                      <CopyButton text={d} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <ContentBlock>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Recommended CTA Button</h4>
                    <p className="text-lg font-bold text-foreground">{data.metaAds.ctaButton}</p>
                  </div>
                  <CopyButton text={data.metaAds.ctaButton} />
                </div>
              </ContentBlock>
            </div>
          </div>
        </TabsContent>

        {/* ── Google Ads Tab ── */}
        <TabsContent value="google" className="mt-4">
          <div className="card-panel">
            <SectionHeader
              icon={Search}
              title="Google Video Ads Copy"
              copyText={[
                'SHORT HEADLINES:\n' + data.googleAds.shortHeadlines.map(h => `• ${h.text} (${h.charCount} chars)`).join('\n'),
                'LONG HEADLINES:\n' + data.googleAds.longHeadlines.map(h => `• ${h}`).join('\n'),
                'DESCRIPTIONS:\n' + data.googleAds.descriptions.map(d => `• ${d}`).join('\n'),
                `5-SECOND HOOK: ${data.googleAds.fiveSecondHook}`,
              ].join('\n\n')}
            />

            <div className="space-y-5">
              {/* 5-Second Hook */}
              <ContentBlock>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-2">⚡ 5-Second Hook Script</h4>
                    <p className="text-sm font-medium text-foreground">{data.googleAds.fiveSecondHook}</p>
                  </div>
                  <CopyButton text={data.googleAds.fiveSecondHook} />
                </div>
              </ContentBlock>

              {/* Short Headlines */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">
                  Short Headlines <span className="text-muted-foreground font-normal normal-case">(max 30 chars)</span>
                </h4>
                <div className="space-y-2">
                  {data.googleAds.shortHeadlines.map((h, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <p className="text-sm font-semibold text-foreground flex-1">{h.text}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs flex-shrink-0 ${h.charCount <= 30 ? 'border-green-500/40 text-green-400' : 'border-red-500/40 text-red-400'}`}
                        >
                          {h.charCount}/30
                        </Badge>
                      </div>
                      <CopyButton text={h.text} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Headlines */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Long Headlines</h4>
                <div className="space-y-2">
                  {data.googleAds.longHeadlines.map((h, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground w-4 mt-0.5">{i + 1}.</span>
                        <p className="text-sm font-semibold text-foreground">{h}</p>
                      </div>
                      <CopyButton text={h} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <h4 className="text-xs font-bold text-brand uppercase tracking-wider mb-3">Descriptions</h4>
                <div className="space-y-2">
                  {data.googleAds.descriptions.map((d, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-muted-foreground w-4 mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-foreground/90">{d}</p>
                      </div>
                      <CopyButton text={d} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Shots Tab ── */}
        <TabsContent value="shots" className="mt-4">
          <div className="card-panel">
            <SectionHeader
              icon={Camera}
              title="Shot Breakdown & Production Notes"
              copyText={[
                'HOOK SHOT:\n' + `Camera: ${data.shotBreakdown.hook.cameraAngle}\nB-Roll: ${data.shotBreakdown.hook.bRoll}\nExpression: ${data.shotBreakdown.hook.expressionCue}`,
                'BODY SHOT:\n' + `Camera: ${data.shotBreakdown.body.cameraAngle}\nB-Roll: ${data.shotBreakdown.body.bRoll}\nExpression: ${data.shotBreakdown.body.expressionCue}`,
                'CTA SHOT:\n' + `Camera: ${data.shotBreakdown.cta.cameraAngle}\nB-Roll: ${data.shotBreakdown.cta.bRoll}\nExpression: ${data.shotBreakdown.cta.expressionCue}`,
                'ON-SCREEN TEXT:\n' + data.shotBreakdown.onScreenText.map(t => `• ${t}`).join('\n'),
                'THUMBNAIL IDEAS:\n' + data.shotBreakdown.thumbnailIdeas.map(t => `• ${t}`).join('\n'),
              ].join('\n\n')}
            />

            <div className="space-y-4">
              {/* Shot sections */}
              {[
                { label: 'HOOK', color: 'text-brand', data: data.shotBreakdown.hook },
                { label: 'BODY', color: 'text-blue-400', data: data.shotBreakdown.body },
                { label: 'CTA', color: 'text-green-400', data: data.shotBreakdown.cta },
              ].map(({ label, color, data: shot }) => (
                <ContentBlock key={label}>
                  <h4 className={`text-xs font-bold ${color} uppercase tracking-wider mb-3`}>
                    🎬 {label} Section
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-1">📷 Camera Angle</p>
                      <p className="text-sm text-foreground/90">{shot.cameraAngle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-1">🎥 B-Roll</p>
                      <p className="text-sm text-foreground/90">{shot.bRoll}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-1">😊 Expression Cue</p>
                      <p className="text-sm text-foreground/90">{shot.expressionCue}</p>
                    </div>
                  </div>
                </ContentBlock>
              ))}

              {/* On-Screen Text */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-brand uppercase tracking-wider">📝 On-Screen Text Overlays</h4>
                  <CopyButton text={data.shotBreakdown.onScreenText.join('\n')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {data.shotBreakdown.onScreenText.map((text, i) => (
                    <div key={i} className="flex items-center gap-2 bg-surface-2 rounded-lg px-3 py-2.5 border border-border/40">
                      <span className="text-brand text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <p className="text-sm text-foreground/90">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thumbnail Ideas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-brand uppercase tracking-wider">🖼 YouTube Thumbnail Ideas</h4>
                  <CopyButton text={data.shotBreakdown.thumbnailIdeas.join('\n')} />
                </div>
                <div className="space-y-2">
                  {data.shotBreakdown.thumbnailIdeas.map((idea, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 bg-surface-2 rounded-lg px-4 py-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <span className="text-brand font-bold text-xs w-4 mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-foreground/90">{idea}</p>
                      </div>
                      <CopyButton text={idea} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
