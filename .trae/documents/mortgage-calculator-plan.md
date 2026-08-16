# 房贷计算分析工具 — 实施计划

## Summary

构建一个 React + Vite + TypeScript 房贷计算分析网页工具，支持等额本息/等额本金两种还款方式、多次提前还款（减少月供或缩短期限）、完整利息计算、以及多维度数据可视化分析。所有计算在客户端完成，无需后端。

## Current State Analysis

- 工作目录为空，从零开始构建
- 用户选择了 web-app-development 和 build-web-apps 插件
- 需要一个专业、干净、可交互的金融工具界面

## Tech Stack

- **框架**: React 18 + Vite + TypeScript
- **样式**: Tailwind CSS（自定义金融工具主题）
- **图表**: Recharts（React 原生图表库，适合数据密集型可视化）
- **图标**: Lucide React
- **无后端** — 所有计算在浏览器端完成

## Proposed Changes

### 项目结构

```
fangdai/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx                      # 入口
│   ├── App.tsx                       # 主布局 + 状态管理
│   ├── index.css                     # Tailwind + 全局样式
│   ├── types/
│   │   └── index.ts                  # 类型定义
│   ├── lib/
│   │   └── mortgage.ts               # 核心计算引擎
│   ├── hooks/
│   │   └── useMortgageCalc.ts        # 计算逻辑 Hook
│   └── components/
│       ├── LoanInputPanel.tsx         # 贷款参数输入面板
│       ├── EarlyRepaymentEditor.tsx   # 提前还款编辑器
│       ├── ResultsSummary.tsx         # 结果汇总卡片
│       ├── AmortizationTable.tsx      # 还款明细表
│       ├── AnnualSummary.tsx          # 年度汇总
│       └── charts/
│           ├── PaymentBreakdownChart.tsx  # 月供构成（本金/利息）堆叠柱状图
│           ├── BalanceTrendChart.tsx      # 剩余本金趋势折线图
│           ├── PrincipalInterestPie.tsx   # 本金/利息占比饼图
│           └── SavingsComparisonChart.tsx  # 提前还款节省对比图
```

### 核心类型定义 (`src/types/index.ts`)

```typescript
// 还款方式
type RepaymentMethod = 'equal_payment' | 'equal_principal';

// 提前还款处理策略
type EarlyRepaymentStrategy = 'reduce_payment' | 'reduce_term';

// 提前还款事件
interface EarlyRepayment {
  id: string;
  month: number;          // 第几个月执行提前还款
  amount: number;         // 提前还款金额
  strategy: EarlyRepaymentStrategy;
}

// 贷款参数
interface LoanParams {
  principal: number;            // 贷款总额（元）
  annualRate: number;           // 年利率（%）
  termYears: number;            // 贷款期限（年）
  method: RepaymentMethod;      // 还款方式
  earlyRepayments: EarlyRepayment[];
}

// 单月还款记录
interface PaymentRecord {
  month: number;               // 第几期
  payment: number;             // 当月总还款（含提前还款）
  scheduledPayment: number;    // 计划月供
  principal: number;           // 本金部分
  interest: number;            // 利息部分
  earlyRepayment?: number;     // 提前还款金额（如有）
  remainingBalance: number;    // 剩余本金
  isEarlyRepaymentMonth: boolean;
}

// 计算结果
interface CalcResult {
  records: PaymentRecord[];          // 完整还款明细
  monthlyPayment: number;             // 首月月供（等额本息为固定值）
  totalPayment: number;               // 总还款额
  totalInterest: number;              // 总利息
  totalPrincipal: number;            // 总本金
  actualTermMonths: number;          // 实际还款月数
  // 对比基准（无提前还款的情况）
  baseline: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    termMonths: number;
  };
  interestSaved: number;              // 节省利息
  monthsSaved: number;                // 节省月数
}
```

### 核心计算引擎 (`src/lib/mortgage.ts`)

#### 等额本息计算

```
月利率 r = 年利率 / 12 / 100
总期数 n = 年限 × 12
月供 M = P × r × (1+r)^n / ((1+r)^n - 1)
```

每月：
- 利息 = 剩余本金 × r
- 本金 = M - 利息
- 剩余本金 -= 本金

#### 等额本金计算

```
每月本金 = P / n
每月还款 = 每月本金 + 剩余本金 × r
```

#### 提前还款处理

当到达提前还款月份时：
1. 先正常计算当月还款（利息、本金）
2. 扣除提前还款金额：剩余本金 -= 提前还款金额
3. 根据策略调整后续还款：
   - **减少月供（期限不变）**: 用剩余本金和剩余期数重新计算月供
     - 新月供 = 剩余本金 × r × (1+r)^剩余期数 / ((1+r)^剩余期数 - 1)
   - **缩短期限（月供不变）**: 保持月供不变，反推剩余期数
     - 剩余期数 = ceil(-log(1 - 剩余本金 × r / 月供) / log(1+r))
     - 最后一期调整差额

4. 多次提前还款：按月份排序后依次处理

#### 基准对比计算

无提前还款时的总利息和总还款额，用于计算节省金额。

### UI 组件设计

#### 1. LoanInputPanel — 贷款参数输入

- 贷款总额输入（元），带快捷按钮（50万/100万/200万/300万）
- 年利率输入（%），带快捷按钮（LPR 3.6% / 4.0% / 4.2% / 4.5%）
- 贷款期限选择（年）：10/15/20/25/30 年，支持自定义
- 还款方式切换：等额本息 / 等额本金（Tab 切换）
- 所有输入实时联动计算结果

#### 2. EarlyRepaymentEditor — 提前还款编辑器

- 可添加多条提前还款记录
- 每条：还款月份（第几期）、金额、处理方式（减少月供/缩短期限）
- 支持删除和编辑
- 按月份自动排序
- 空状态提示

#### 3. ResultsSummary — 结果汇总

卡片式展示：
- 月供金额（首月）
- 总利息
- 总还款额
- 实际还款月数
- 节省利息（与无提前还款对比，绿色高亮）
- 节省月数

#### 4. 图表区域

- **月供构成堆叠柱状图**: 每月本金（蓝色）+ 利息（橙色）堆叠，标记提前还款月份
- **剩余本金趋势折线图**: 展示本金下降曲线，提前还款处标注拐点
- **本金/利息占比饼图**: 总本金 vs 总利息占比
- **提前还款效果对比柱状图**: 无提前还款 vs 有提前还款的总利息、总还款额对比

#### 5. AmortizationTable — 还款明细表

- 列：期次、月供、本金、利息、提前还款、剩余本金
- 支持分页或滚动
- 提前还款行高亮标记
- 年度汇总切换视图

#### 6. AnnualSummary — 年度汇总

- 按年汇总：年还款总额、年本金、年利息、年末剩余本金
- 表格 + 柱状图

### 设计系统

- **主色调**: 深蓝 `#1e40af` (信任、专业)
- **辅助色**: 青色 `#0891b2`、绿色 `#16a34a`（节省/正向）、橙色 `#ea580c`（利息/支出）
- **背景**: `#f8fafc` (slate-50) 浅灰底，白色卡片
- **字体**: 系统字体栈，数字使用 `font-variant-numeric: tabular-nums` 等宽数字
- **圆角**: `rounded-xl` 卡片，`rounded-lg` 输入框
- **阴影**: `shadow-sm` 轻阴影，hover 时 `shadow-md`
- **间距**: 充足留白，卡片间距 `gap-6`

### 响应式

- 桌面端：左右双栏布局（左侧输入参数，右侧结果+图表）
- 移动端：单栏堆叠

## Implementation Steps

### Step 1: 项目初始化
- `npm create vite@latest . -- --template react-ts`
- 安装依赖：`tailwindcss`, `postcss`, `autoprefixer`, `recharts`, `lucide-react`
- 配置 Tailwind CSS（主题色、字体）
- 配置 tsconfig 路径别名

### Step 2: 类型定义与计算引擎
- 创建 `src/types/index.ts`
- 实现 `src/lib/mortgage.ts`：
  - `calcEqualPayment()` — 等额本息计算
  - `calcEqualPrincipal()` — 等额本金计算
  - `applyEarlyRepayments()` — 提前还款处理
  - `calcBaseline()` — 基准计算（无提前还款）
  - `calcMortgage()` — 主入口函数，返回 CalcResult

### Step 3: 设计概念生成
- 使用 Image Gen 生成 1-2 张界面概念图
- 提取设计 tokens（颜色、字体、间距、圆角）
- 获得设计方向确认

### Step 4: 输入面板组件
- `LoanInputPanel.tsx` — 贷款参数表单
- `EarlyRepaymentEditor.tsx` — 提前还款编辑器
- 实时联动计算

### Step 5: 结果与图表组件
- `ResultsSummary.tsx` — 汇总卡片
- 四个图表组件
- `AmortizationTable.tsx` — 明细表
- `AnnualSummary.tsx` — 年度汇总

### Step 6: 主布局组装
- `App.tsx` — 组合所有组件
- 响应式布局
- 状态管理（useState/useMemo）

### Step 7: 样式打磨与交互优化
- 数字格式化（千分位、货币符号）
- 动画过渡
- hover/active 状态
- 空状态处理

### Step 8: 验证
- 浏览器打开验证
- 桌面端 + 移动端响应式检查
- 计算准确性验证（与已知房贷计算器对比）
- 图表渲染验证

## Assumptions & Decisions

1. **选择 React + Vite 而非单 HTML 文件** — 数据密集型工具，需要复杂状态管理（多次提前还款列表）和多个交互式图表组件，React 的组件化和状态管理更适合。frontend-app-builder skill 也推荐 React + Vite 用于 data-heavy tools。

2. **选择 Recharts 而非 Chart.js** — Recharts 是 React 原生图表库，与 React 组件模型深度集成，更易实现交互和响应式。

3. **两种还款方式都支持** — 等额本息和等额本金是两种主流房贷还款方式，都需要支持。

4. **提前还款两种策略都支持** — 减少月供（期限不变）和缩短期限（月供不变），用户可为每次提前还款选择不同策略。

5. **所有计算在客户端** — 无需后端，无需 API，工具可直接部署为静态站点或本地运行。

6. **不使用 Image Gen 概念图作为阻塞性步骤** — 金融工具界面以功能性和数据展示为主，使用 Tailwind 直接实现干净专业的 UI 即可。若用户需要视觉概念图可后续补充。

## Verification Steps

1. **计算准确性**: 使用已知房贷计算器（如网上银行工具）对比验证：
   - 100万贷款，4.2%利率，30年，等额本息 → 月供应为约 ¥4,890.17
   - 100万贷款，4.2%利率，30年，等额本金 → 首月 ¥6,388.89，末月 ¥2,792.36
   - 第12个月提前还款10万（减少月供）→ 验证新月供计算
   - 第12个月提前还款10万（缩短期限）→ 验证新期限计算

2. **多次提前还款**: 添加3条不同月份的提前还款记录，验证依次正确处理

3. **图表渲染**: 所有4个图表正确渲染，数据与表格一致

4. **响应式**: 桌面端双栏，移动端单栏，无溢出

5. **边界情况**:
   - 无提前还款时正常显示
   - 提前还款金额超过剩余本金时的处理
   - 利率为0时的处理
   - 极端值输入的处理
