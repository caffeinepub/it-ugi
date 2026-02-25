import { useState } from 'react';
import { Zap, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import type { FormInputs, Platform, FunnelStage, ToneMode } from '../utils/creativeGenerator';

interface CreativeFormProps {
  onSubmit: (inputs: FormInputs) => void;
}

const PLATFORMS: Array<{ id: Platform; label: string; icon: string }> = [
  { id: 'youtube', label: 'YouTube', icon: '▶' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: '👥' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'meta_ads', label: 'Meta Ads', icon: '📊' },
  { id: 'google_video', label: 'Google Video', icon: '🎯' },
];

const FUNNEL_STAGES: Array<{ id: FunnelStage; label: string; desc: string }> = [
  { id: 'cold', label: 'Cold Audience', desc: 'Brand new — never heard of you' },
  { id: 'warm', label: 'Warm Retargeting', desc: 'Engaged but haven\'t converted' },
  { id: 'hot', label: 'Hot Conversion', desc: 'Ready to buy — push them over' },
];

const TONE_MODES: Array<{ id: ToneMode; label: string; desc: string; color: string }> = [
  { id: 'aggressive', label: 'Aggressive Hard Sell', desc: 'High urgency, direct, FOMO-driven', color: 'text-red-400' },
  { id: 'soft', label: 'Soft Persuasive', desc: 'Empathetic, friendly, benefit-led', color: 'text-green-400' },
  { id: 'authority', label: 'Authority-Driven', desc: 'Expert positioning, trust-building', color: 'text-blue-400' },
  { id: 'luxury', label: 'Luxury Positioning', desc: 'Premium, exclusive, aspirational', color: 'text-yellow-400' },
];

export default function CreativeForm({ onSubmit }: CreativeFormProps) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [funnelStage, setFunnelStage] = useState<FunnelStage>('cold');
  const [toneMode, setToneMode] = useState<ToneMode>('aggressive');
  const [competitorInfo, setCompetitorInfo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const togglePlatform = (platform: Platform) => {
    setPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!productName.trim()) newErrors.productName = 'Product name is required';
    if (!description.trim() || description.trim().length < 20) {
      newErrors.description = 'Please provide a description of at least 20 characters';
    }
    if (platforms.length === 0) newErrors.platforms = 'Select at least one platform';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      productName: productName.trim(),
      description: description.trim(),
      platforms,
      funnelStage,
      toneMode,
      competitorInfo: competitorInfo.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Step 1: Product Info */}
      <section className="card-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="step-badge">1</div>
          <div>
            <h2 className="section-heading">Product / Service Details</h2>
            <p className="text-muted-foreground text-sm">Tell us what you're promoting</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="form-label">
              Product / Service Name <span className="text-brand">*</span>
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. FitPro Protein Powder, SaaS Dashboard Tool..."
              className="input-field mt-1.5"
            />
            {errors.productName && (
              <p className="error-text mt-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.productName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="form-label">
              Description <span className="text-brand">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your product/service, its key benefits, unique selling points, and target audience. The more detail you provide, the better the output."
              rows={5}
              className="input-field mt-1.5 resize-none"
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.description ? (
                <p className="error-text"><AlertCircle className="w-3.5 h-3.5" />{errors.description}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs ${description.length < 20 ? 'text-muted-foreground' : 'text-brand'}`}>
                {description.length} chars
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Platforms */}
      <section className="card-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="step-badge">2</div>
          <div>
            <h2 className="section-heading">Target Platforms</h2>
            <p className="text-muted-foreground text-sm">Select all platforms you're running ads on</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLATFORMS.map(platform => (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={`platform-card ${platforms.includes(platform.id) ? 'platform-card-active' : ''}`}
            >
              <Checkbox
                checked={platforms.includes(platform.id)}
                className="pointer-events-none"
                onCheckedChange={() => {}}
              />
              <span className="text-lg">{platform.icon}</span>
              <span className="font-medium text-sm">{platform.label}</span>
            </button>
          ))}
        </div>
        {errors.platforms && (
          <p className="error-text mt-3"><AlertCircle className="w-3.5 h-3.5" />{errors.platforms}</p>
        )}
      </section>

      {/* Step 3: Funnel Stage */}
      <section className="card-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="step-badge">3</div>
          <div>
            <h2 className="section-heading">Funnel Stage</h2>
            <p className="text-muted-foreground text-sm">Who are you targeting?</p>
          </div>
        </div>

        <RadioGroup
          value={funnelStage}
          onValueChange={v => setFunnelStage(v as FunnelStage)}
          className="space-y-3"
        >
          {FUNNEL_STAGES.map(stage => (
            <label
              key={stage.id}
              htmlFor={`funnel-${stage.id}`}
              className={`radio-card ${funnelStage === stage.id ? 'radio-card-active' : ''}`}
            >
              <RadioGroupItem value={stage.id} id={`funnel-${stage.id}`} className="mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-foreground">{stage.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stage.desc}</div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </section>

      {/* Step 4: Tone Mode */}
      <section className="card-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="step-badge">4</div>
          <div>
            <h2 className="section-heading">Tone Mode</h2>
            <p className="text-muted-foreground text-sm">How should the copy feel?</p>
          </div>
        </div>

        <RadioGroup
          value={toneMode}
          onValueChange={v => setToneMode(v as ToneMode)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {TONE_MODES.map(tone => (
            <label
              key={tone.id}
              htmlFor={`tone-${tone.id}`}
              className={`radio-card ${toneMode === tone.id ? 'radio-card-active' : ''}`}
            >
              <RadioGroupItem value={tone.id} id={`tone-${tone.id}`} className="mt-0.5" />
              <div>
                <div className={`font-semibold text-sm ${toneMode === tone.id ? tone.color : 'text-foreground'}`}>
                  {tone.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{tone.desc}</div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </section>

      {/* Step 5: Competitor Info (Optional) */}
      <section className="card-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="step-badge step-badge-optional">5</div>
          <div>
            <h2 className="section-heading">
              Competitor Analysis
              <Badge variant="outline" className="ml-2 text-xs border-muted-foreground/30 text-muted-foreground">
                Optional
              </Badge>
            </h2>
            <p className="text-muted-foreground text-sm">Provide competitor info to sharpen your positioning</p>
          </div>
        </div>

        <Textarea
          value={competitorInfo}
          onChange={e => setCompetitorInfo(e.target.value)}
          placeholder="e.g. Main competitor is BrandX — they focus on price but lack quality. Their weakness is poor customer support and slow delivery..."
          rows={3}
          className="input-field resize-none"
        />
      </section>

      {/* Submit */}
      <div className="flex justify-center pb-4">
        <Button
          type="submit"
          size="lg"
          className="btn-brand gap-3 px-10 py-6 text-base font-bold"
        >
          <Zap className="w-5 h-5 fill-current" />
          Generate Creative Package
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
