import { Home, Percent, Calendar, Repeat, CalendarDays, Skull, Cog, Crosshair, Flame, Atom, FlaskConical, BookOpen, Sparkles } from 'lucide-react';
import type { LoanParams, RepaymentMethod } from '../types';
import type { Theme } from '../App';

interface Props {
  params: LoanParams;
  onChange: (params: LoanParams) => void;
  theme?: Theme;
}

const quickAmounts = [50, 100, 200, 300];
const quickRates = [3.0, 3.6, 4.0, 4.2, 4.5];
const quickTerms = [10, 15, 20, 25, 30];

export default function LoanInputPanel({ params, onChange, theme = 'apple' }: Props) {
  const update = (patch: Partial<LoanParams>) => onChange({ ...params, ...patch });
  const isWh = theme === 'warhammer';
  const isRm = theme === 'rickmorty';
  const isHp = theme === 'harrypotter';
  const isThemed = isWh || isRm || isHp;

  const pfx = isWh ? 'wh' : isRm ? 'rm' : isHp ? 'hp' : '';
  const cardCls = isWh ? 'wh-data-card' : isRm ? 'rm-data-card' : isHp ? 'hp-data-card' : 'apple-card';
  const panelHdr = isWh ? 'wh-panel-header' : isRm ? 'rm-panel-header' : isHp ? 'hp-panel-header' : 'mb-4';
  const gothicLbl = isWh ? 'wh-gothic-label' : isRm ? 'rm-gothic-label' : isHp ? 'hp-gothic-label' : 'text-text-600';
  const labelGold = isWh ? 'wh-label-gold opacity-60' : isRm ? 'rm-label-blue opacity-70' : isHp ? 'hp-label-gold opacity-70' : 'text-text-400';
  const labelDim = isWh ? 'wh-label-gold opacity-50' : isRm ? 'rm-label-blue opacity-60' : isHp ? 'hp-label-gold opacity-55' : 'text-text-400';
  const grooveFld = isThemed ? `${pfx}-groove-field apple-field` : 'apple-field';
  const grooveInp = isThemed ? `${pfx}-groove-input` : '';
  const mechKey = isWh ? 'wh-mech-key' : isRm ? 'rm-mech-key' : isHp ? 'hp-mech-key' : '';
  const mechKeyActive = isWh ? 'wh-mech-key-active' : isRm ? 'rm-mech-key-active' : isHp ? 'hp-mech-key-active' : '';

  const t = {
    panelTitle: isWh ? '殉道契约参数' : isRm ? '实验契约参数' : isHp ? '远古誓约参数' : '贷款参数',
    panelSub: isWh ? '凡铁承誓 · 订立永世劳役契约' : isRm ? '搭建维度锚点 · 确立跨时空实验盟约' : isHp ? '构筑魔法祭坛 · 缔结永世魔力盟约' : '设置贷款基本信息，实时计算结果',
    amountLabel: isWh ? '誓约负重' : isRm ? '锚点负荷' : isHp ? '誓约枷锁' : '贷款总额',
    amountUnit: isWh ? '万铸币' : isRm ? '万能量单位' : isHp ? '万魔法晶石' : '万元',
    rateLabel: isWh ? '血贡刻度' : isRm ? '维度耗损系数' : isHp ? '魔力流失阈值' : '年利率',
    termLabel: isWh ? '殉道时长' : isRm ? '实验持续周期' : isHp ? '契约维系时长' : '贷款期限',
    termUnit: isWh ? '纪年' : isRm ? '星历周期' : isHp ? '星运纪年' : '年',
    dateLabel: isWh ? '誓约启始纪元' : isRm ? '盟约启动时点' : isHp ? '盟约启始之日' : '贷款起始日',
    methodLabel: isWh ? '赎罪范式' : isRm ? '能量偿付模式' : isHp ? '魔力供给范式' : '还款方式',
    methodEP: isWh ? '恒定血贡' : isRm ? '稳态供能' : isHp ? '稳态咏供' : '等额本息',
    methodEPr: isWh ? '本源均分' : isRm ? '本源均分' : isHp ? '本源均分' : '等额本金',
    methodEPDesc: isWh ? '献祭恒定 · 铁律不朽' : isRm ? '能量供给恒定 · 维度法则恒定不变' : isHp ? '魔力咏诵恒定 · 魔法法则恒久不变' : '月供固定',
    methodEPrDesc: isWh ? '利息递减 · 渐获解脱' : isRm ? '利息递减 · 渐获解脱' : isHp ? '利息递减 · 渐获解脱' : '利息递减',
    amtBtn: (a: number) => isWh ? `${a}万铸币` : isRm ? `${a}万能量单位` : isHp ? `${a}万魔法晶石` : `${a}万`,
    rateBtn: (r: number) => isWh ? `${r}阶血贡` : isRm ? `${r}阶耗损` : isHp ? `${r}阶魔力流失` : `${r}%`,
    termBtn: (y: number) => isWh ? `${y}纪年` : isRm ? `${y}星历` : isHp ? `${y}星运` : `${y}年`,
  };

  return (
    <div className={`${cardCls} p-5`}>
      {isThemed && (
        <>
          <span className={`${pfx}-rivet ${pfx}-rivet-tl`} />
          <span className={`${pfx}-rivet ${pfx}-rivet-tr`} />
          <span className={`${pfx}-rivet ${pfx}-rivet-bl`} />
          <span className={`${pfx}-rivet ${pfx}-rivet-br`} />
        </>
      )}

      {/* Header */}
      <div className={`flex items-center gap-2.5 ${panelHdr}`}>
        <div className={`w-8 h-8 flex items-center justify-center ${isThemed ? '' : 'rounded-[0.6rem] bg-brand-500/10'}`}>
          {isWh ? (
            <Skull className="w-4 h-4" style={{ color: 'var(--wh-gold)', filter: 'drop-shadow(0 0 4px rgba(184,134,11,0.3))' }} />
          ) : isRm ? (
            <Atom className="w-4 h-4 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.3))' }} />
          ) : isHp ? (
            <BookOpen className="w-4 h-4" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.3))' }} />
          ) : (
            <Home className="w-4 h-4 text-brand-500" />
          )}
        </div>
        <div>
          <h2
            className={`text-[15px] font-bold ${isWh ? 'wh-nameplate-title' : isRm ? 'rm-nameplate-title' : isHp ? 'hp-nameplate-title' : 'text-text-800'}`}
            style={isWh ? { fontSize: '15px !important' } : isRm ? { fontSize: '15px !important' } : isHp ? { fontSize: '15px !important' } : undefined}
          >
            {t.panelTitle}
          </h2>
          <p className={`text-[11px] ${labelGold}`}>{t.panelSub}</p>
        </div>
      </div>

      {/* Horizontal Input Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Loan Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-[12px] font-medium ${gothicLbl}`}>{t.amountLabel}</label>
            <span className={`text-[11px] ${labelDim}`}>{t.amountUnit}</span>
          </div>
          <div className={grooveFld}>
            <input
              type="number"
              value={params.principal / 10000 || ''}
              onChange={(e) => update({ principal: parseFloat(e.target.value) * 10000 || 0 })}
              className={`apple-input font-mono font-semibold text-[16px] tabular-nums ${grooveInp}`}
              placeholder="100"
              step="5"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => update({ principal: amt * 10000 })}
                className={isThemed
                  ? `${mechKey} ${params.principal === amt * 10000 ? mechKeyActive : ''}`
                  : `px-2 py-0.5 rounded-full text-[10px] font-semibold transition font-mono ${
                      params.principal === amt * 10000
                        ? 'bg-brand-500 text-white shadow-apple-sm'
                        : 'bg-background-200 text-text-500 hover:bg-background-300'
                    }`
                }
              >
                {t.amtBtn(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-[12px] font-medium flex items-center gap-1 ${gothicLbl}`}>
              {isWh ? <Flame className="w-3 h-3" style={{ color: 'var(--wh-blood-bright)' }} /> : isRm ? <FlaskConical className="w-3 h-3" style={{ color: 'var(--rm-blue)' }} /> : isHp ? <Sparkles className="w-3 h-3" style={{ color: 'var(--hp-emerald)' }} /> : <Percent className="w-3 h-3 text-text-400" />}
              {t.rateLabel}
            </label>
            <span className={`text-[11px] ${labelDim}`}>%</span>
          </div>
          <div className={grooveFld}>
            <input
              type="number"
              value={params.annualRate || ''}
              onChange={(e) => update({ annualRate: parseFloat(e.target.value) || 0 })}
              className={`apple-input font-mono font-semibold text-[16px] tabular-nums ${grooveInp}`}
              placeholder="4.2"
              step="0.05"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {quickRates.map((rate) => (
              <button
                key={rate}
                onClick={() => update({ annualRate: rate })}
                className={isThemed
                  ? `${mechKey} ${params.annualRate === rate ? mechKeyActive : ''}`
                  : `px-2 py-0.5 rounded-full text-[10px] font-semibold transition font-mono ${
                      params.annualRate === rate
                        ? 'bg-brand-500 text-white shadow-apple-sm'
                        : 'bg-background-200 text-text-500 hover:bg-background-300'
                    }`
                }
              >
                {t.rateBtn(rate)}
              </button>
            ))}
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-[12px] font-medium flex items-center gap-1 ${gothicLbl}`}>
              {isWh ? <Cog className="w-3 h-3" style={{ color: 'var(--wh-gold)' }} /> : isRm ? <Atom className="w-3 h-3 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)' }} /> : isHp ? <BookOpen className="w-3 h-3" style={{ color: 'var(--hp-gold)' }} /> : <Calendar className="w-3 h-3 text-text-400" />}
              {t.termLabel}
            </label>
            <span className={`text-[11px] ${labelDim}`}>{t.termUnit}</span>
          </div>
          <div className={grooveFld}>
            <input
              type="number"
              value={params.termYears || ''}
              onChange={(e) => update({ termYears: parseInt(e.target.value) || 0 })}
              className={`apple-input font-mono font-semibold text-[16px] tabular-nums ${grooveInp}`}
              placeholder="30"
              step="1"
              min="1"
              max="50"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => update({ termYears: term })}
                className={isThemed
                  ? `${mechKey} ${params.termYears === term ? mechKeyActive : ''}`
                  : `px-2 py-0.5 rounded-full text-[10px] font-semibold transition font-mono ${
                      params.termYears === term
                        ? 'bg-brand-500 text-white shadow-apple-sm'
                        : 'bg-background-200 text-text-500 hover:bg-background-300'
                    }`
                }
              >
                {t.termBtn(term)}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className={`text-[12px] font-medium flex items-center gap-1 ${gothicLbl}`}>
            {isWh ? <Crosshair className="w-3 h-3" style={{ color: 'var(--wh-gold)' }} /> : isRm ? <FlaskConical className="w-3 h-3" style={{ color: 'var(--rm-blue)' }} /> : isHp ? <BookOpen className="w-3 h-3" style={{ color: 'var(--hp-gold)' }} /> : <CalendarDays className="w-3 h-3 text-text-400" />}
            {t.dateLabel}
          </label>
          <div className={grooveFld}>
            <input
              type="month"
              value={params.startDate || ''}
              onChange={(e) => update({ startDate: e.target.value })}
              className={`apple-input font-mono font-medium text-[14px] flex-1 ${grooveInp}`}
            />
          </div>
          <div className="h-4" />
        </div>

        {/* Repayment Method */}
        <div className="space-y-2">
          <label className={`text-[12px] font-medium flex items-center gap-1 ${gothicLbl}`}>
            <Repeat className={`w-3 h-3 ${isThemed ? '' : 'text-text-400'}`} style={isWh ? { color: 'var(--wh-gold)' } : isRm ? { color: 'var(--rm-green-bright)' } : isHp ? { color: 'var(--hp-gold)' } : undefined} />
            {t.methodLabel}
          </label>
          <div className="apple-segmented">
            {(['equal_payment', 'equal_principal'] as RepaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => update({ method: m })}
                className={params.method === m ? 'active' : ''}
              >
                {m === 'equal_payment' ? t.methodEP : t.methodEPr}
              </button>
            ))}
          </div>
          <p className={`text-[11px] leading-relaxed ${labelDim}`}>
            {params.method === 'equal_payment' ? t.methodEPDesc : t.methodEPrDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
