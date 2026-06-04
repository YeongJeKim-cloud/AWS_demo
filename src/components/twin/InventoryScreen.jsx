import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChevronRight, CircleDollarSign, FileText, Layers, PackageCheck, PieChart, RefreshCcw, TrendingUp } from 'lucide-react';
import {
  INV_ASSESSMENT,
  INV_COST_INCOME,
  INV_CUMULATIVE,
  INV_GROWTH,
  INV_HUB,
  INV_MONTHLY,
  INV_REVENUE,
  INV_TURNOVER,
} from '../../data/twin';

const TIP = {
  background: 'rgba(4, 12, 28, 0.96)',
  border: '1px solid rgba(47, 232, 255, 0.42)',
  borderRadius: 0,
  color: '#eaf8ff',
  fontSize: 11,
};

const AX = { stroke: '#8eb2d6', fontSize: 10, tickLine: false };
const KPI_ICONS = [Layers, TrendingUp, PieChart, CircleDollarSign, PackageCheck, RefreshCcw];

function MiniLine({ data, series, height = 165 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 14, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(47,232,255,0.13)" vertical={false} />
        <XAxis dataKey="m" {...AX} axisLine={{ stroke: '#1f6795' }} interval="preserveStartEnd" />
        <YAxis {...AX} axisLine={false} width={40} />
        <Tooltip contentStyle={TIP} />
        {series.map((s) => (
          <Line key={s.k} type="monotone" dataKey={s.k} name={s.name} stroke={s.c} strokeWidth={3} dot={false} activeDot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniBar({ data, series, height = 165 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 14, left: -8, bottom: 0 }} barGap={5}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(47,232,255,0.13)" vertical={false} />
        <XAxis dataKey="m" {...AX} axisLine={{ stroke: '#1f6795' }} interval="preserveStartEnd" />
        <YAxis {...AX} axisLine={false} width={40} />
        <Tooltip contentStyle={TIP} cursor={{ fill: 'rgba(47,232,255,0.07)' }} />
        {series.map((s) => (
          <Bar key={s.k} dataKey={s.k} name={s.name} fill={s.c} radius={[3, 3, 0, 0]} barSize={12} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function Block({ title, en, className = '', children }) {
  return (
    <div className={`inv-block ${className}`}>
      <h5>{title}<span>{en}</span></h5>
      {children}
    </div>
  );
}

export default function InventoryScreen({ onNavigate }) {
  return (
    <div className="inv">
      <div className="inv-col inv-left">
        <Block title="Growth Rate Analysis" en="Growth Rate">
          <MiniLine
            data={INV_GROWTH}
            series={[
              { k: 'inv', name: 'Inventory Growth Rate', c: '#178dff' },
              { k: 'rev', name: 'Revenue Growth Rate', c: '#1ff4ff' },
            ]}
          />
        </Block>

        <Block title="Monthly Change in Inventory" en="Monthly Change" className="inv-table-block">
          <table className="twin-table inv-table">
            <thead>
              <tr><th>Month</th><th>Inventory</th><th>Main Business Income</th><th>Main Business Cost</th><th>Revenue Growth Rate</th></tr>
            </thead>
            <tbody>
              {INV_MONTHLY.map((r) => (
                <tr key={r.m}>
                  <td>{r.m}</td>
                  <td>{r.inv.toLocaleString()}</td>
                  <td>{r.income.toLocaleString()}</td>
                  <td>{r.cost.toLocaleString()}</td>
                  <td>{r.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        <Block title="Inventory Turnover Trend Analysis" en="Turnover Trend">
          <MiniBar
            data={INV_TURNOVER}
            series={[
              { k: 'cur', name: 'This Year', c: '#178dff' },
              { k: 'prev', name: 'Last Year', c: '#b9e7ff' },
            ]}
          />
        </Block>
      </div>

      <div className="inv-center">
        <div className="inv-hub">
          <div className="inv-globe-grid" />
          <div className="inv-hub-core">
            <div className="inv-hub-ring" />
            <b>Inventory</b>
            <span>Digital Inventory Graph</span>
          </div>
          {INV_HUB.map((n, i) => {
            const Icon = KPI_ICONS[i] || Layers;
            return (
              <div className={`inv-node inv-n${i} t-${n.tone}`} key={n.label}>
                <span className="inv-node-icon"><Icon size={26} strokeWidth={1.9} /></span>
                <div>
                  <b>{n.value}</b>
                  <span>{n.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="inv-action-row">
          <h5>Monthly Assessment Report</h5>
          <button type="button" className="inv-enter" onClick={() => onNavigate?.('dashboard')}>
            Enter <ChevronRight size={16} />
          </button>
        </div>

        <div className="inv-assess">
          {INV_ASSESSMENT.map((a) => (
            <div className="inv-report-row" key={a}>
              <FileText size={16} />
              <p><b>{a} :</b><span> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="inv-col inv-right">
        <Block title="Cumulative Inventory Analysis" en="Cumulative">
          <MiniLine
            data={INV_CUMULATIVE}
            series={[
              { k: 'inv', name: 'Inventory', c: '#178dff' },
              { k: 'same', name: 'Inventory of Same Period', c: '#1ff4ff' },
            ]}
          />
        </Block>

        <Block title="Cost-Income Analysis" en="Cost / Income">
          <MiniLine
            data={INV_COST_INCOME}
            series={[
              { k: 'income', name: 'Main Business Income', c: '#178dff' },
              { k: 'cost', name: 'Main Business Cost', c: '#1ff4ff' },
            ]}
          />
        </Block>

        <Block title="Inventory Revenue Trend Analysis" en="Revenue Trend">
          <MiniBar
            data={INV_REVENUE}
            series={[
              { k: 'inv', name: 'Inventory', c: '#178dff' },
              { k: 'income', name: 'Main Business Income', c: '#b9e7ff' },
            ]}
          />
        </Block>
      </div>
    </div>
  );
}
