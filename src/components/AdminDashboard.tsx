import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './AdminDashboard.css';

interface SalesData {
  date: string;
  amount: number;
}

// Sample data sets for testing
const sampleDataSets = {
  monthly: [
    { date: '2024-01', amount: 1200 },
    { date: '2024-02', amount: 1900 },
    { date: '2024-03', amount: 1500 },
    { date: '2024-04', amount: 2100 },
    { date: '2024-05', amount: 1800 },
  ],
  quarterly: [
    { date: '2023-Q3', amount: 4500 },
    { date: '2023-Q4', amount: 5200 },
    { date: '2024-Q1', amount: 4800 },
    { date: '2024-Q2', amount: 5100 },
  ],
  yearly: [
    { date: '2020', amount: 15000 },
    { date: '2021', amount: 18000 },
    { date: '2022', amount: 22000 },
    { date: '2023', amount: 25000 },
    { date: '2024', amount: 28000 },
  ],
  seasonal: [
    { date: '2024-01', amount: 800 },
    { date: '2024-02', amount: 1200 },
    { date: '2024-03', amount: 1500 },
    { date: '2024-04', amount: 1800 },
    { date: '2024-05', amount: 2100 },
    { date: '2024-06', amount: 2400 },
    { date: '2024-07', amount: 2800 },
    { date: '2024-08', amount: 2600 },
    { date: '2024-09', amount: 2200 },
    { date: '2024-10', amount: 1900 },
    { date: '2024-11', amount: 1600 },
    { date: '2024-12', amount: 1300 },
  ],
};

// Ridgeline chart mock data
const ridgelineData = [
  {
    category: 'Electronics',
    values: [
      { x: 1, y: 10 }, { x: 2, y: 30 }, { x: 3, y: 20 }, { x: 4, y: 40 }, { x: 5, y: 25 },
      { x: 6, y: 35 }, { x: 7, y: 30 }, { x: 8, y: 45 }, { x: 9, y: 20 }, { x: 10, y: 15 }
    ]
  },
  {
    category: 'Fashion',
    values: [
      { x: 1, y: 5 }, { x: 2, y: 15 }, { x: 3, y: 10 }, { x: 4, y: 25 }, { x: 5, y: 20 },
      { x: 6, y: 30 }, { x: 7, y: 25 }, { x: 8, y: 35 }, { x: 9, y: 10 }, { x: 10, y: 5 }
    ]
  },
  {
    category: 'Home',
    values: [
      { x: 1, y: 8 }, { x: 2, y: 18 }, { x: 3, y: 12 }, { x: 4, y: 28 }, { x: 5, y: 22 },
      { x: 6, y: 32 }, { x: 7, y: 28 }, { x: 8, y: 38 }, { x: 9, y: 12 }, { x: 10, y: 8 }
    ]
  },
  {
    category: 'Toys',
    values: [
      { x: 1, y: 3 }, { x: 2, y: 8 }, { x: 3, y: 6 }, { x: 4, y: 12 }, { x: 5, y: 10 },
      { x: 6, y: 15 }, { x: 7, y: 12 }, { x: 8, y: 18 }, { x: 9, y: 6 }, { x: 10, y: 3 }
    ]
  }
];

const RidgelineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{cat: string, x: number, y: number, value: number} | null>(null);
  const width = 1100;
  const height = 520;
  const margin = { top: 90, right: 50, bottom: 70, left: 120 };
  const bandCount = ridgelineData.length;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const bandSpacing = innerHeight / (bandCount - 1);
  const yGlobal = d3.scaleLinear().domain([0, 50]).range([innerHeight, 0]);
  const fontSize = 18;
  const legendFontSize = 22;
  const labelFontSize = 20;

  // Color scale
  const color = d3.scaleOrdinal<string>()
    .domain(ridgelineData.map(d => d.category))
    .range(['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc']);

  // Legend (not bold, smaller)
  const legend = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 32,
      marginBottom: 10,
      fontSize: legendFontSize,
      fontWeight: 400,
      letterSpacing: 0.5,
      textShadow: 'none',
    }}>
      {ridgelineData.map(cat => (
        <span key={cat.category} style={{
          color: color(cat.category),
          fontWeight: 400,
          fontSize: legendFontSize,
          textShadow: 'none',
          opacity: highlighted && highlighted !== cat.category ? 0.3 : 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={() => setHighlighted(cat.category)}
        onMouseLeave={() => setHighlighted(null)}
        >
          {cat.category}
        </span>
      ))}
    </div>
  );

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('*').remove();

    const x = d3.scaleLinear().domain([1, 10]).range([0, innerWidth]);
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Grid lines (y axis)
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yGlobal).ticks(5).tickSize(-innerWidth).tickFormat('' as any))
      .selectAll('line')
      .attr('stroke', '#e0e0e0');

    ridgelineData.forEach((cat, i) => {
      const offset = i * bandSpacing;
      // Area under the curve
      const gradId = `ridgeline-gradient-${cat.category}`;
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient')
        .attr('id', gradId)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', color(cat.category) as string).attr('stop-opacity', 0.35);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color(cat.category) as string).attr('stop-opacity', 0.10);

      const areaPath = d3.area<{ x: number, y: number }>()
        .x(d => x(d.x))
        .y0(_ => yGlobal(0) - offset)
        .y1(d => yGlobal(d.y) - offset)
        .curve(d3.curveBasis);
      svg.append('path')
        .datum(cat.values)
        .attr('fill', `url(#${gradId})`)
        .attr('opacity', highlighted && highlighted !== cat.category ? 0.12 : 0.35)
        .attr('stroke', 'none')
        .attr('d', areaPath)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .on('mousemove', function(event, _) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          const xm = x.invert(mx - margin.left);
          const closest = cat.values.reduce((a, b) => Math.abs(b.x - xm) < Math.abs(a.x - xm) ? b : a);
          setTooltip({ cat: cat.category, x: mx, y: my, value: closest.y });
        })
        .on('mouseleave', () => setTooltip(null));

      const line = d3.line<{ x: number, y: number }>()
        .x(d => x(d.x))
        .y(d => yGlobal(d.y) - offset)
        .curve(d3.curveBasis);
      svg.append('path')
        .datum(cat.values)
        .attr('fill', 'none')
        .attr('stroke', color(cat.category) as string)
        .attr('stroke-width', highlighted === cat.category ? 7 : 4)
        .attr('opacity', highlighted && highlighted !== cat.category ? 0.2 : 1)
        .attr('d', line)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .on('mouseenter', () => setHighlighted(cat.category))
        .on('mouseleave', () => setHighlighted(null));

      svg.append('text')
        .attr('x', margin.left - 15)
        .attr('y', yGlobal(0) - offset + margin.top + 7)
        .attr('fill', color(cat.category) as string)
        .attr('font-size', labelFontSize)
        .attr('font-weight', 400)
        .attr('opacity', highlighted && highlighted !== cat.category ? 0.2 : 1)
        .attr('text-anchor', 'end')
        .text(cat.category)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHighlighted(cat.category))
        .on('mouseleave', () => setHighlighted(null));
    });

    // X axis (drawn once at the bottom)
    svg.append('g')
      .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10))
      .selectAll('text')
      .style('font-size', fontSize)
      .style('font-weight', 400);

    // Y axis (drawn once at the left)
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yGlobal).ticks(5))
      .selectAll('text')
      .style('font-size', fontSize)
      .style('font-weight', 400);
  }, [highlighted]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0, position: 'relative' }}>
      {legend}
      <svg ref={svgRef} style={{ width: '100%', maxWidth: 1100, height: 500, display: 'block', margin: '0 auto', borderRadius: 24, boxShadow: '0 4px 24px #ab47bc22' }}></svg>
      {tooltip && (
        <div
          className="d3-tooltip"
          style={{
            left: tooltip.x + 30,
            top: tooltip.y + 10,
            position: 'absolute',
            background: 'rgba(255,255,255,0.97)',
            border: `2px solid ${color(tooltip.cat)}`,
            borderRadius: 12,
            padding: '14px 22px',
            pointerEvents: 'none',
            color: color(tooltip.cat),
            fontWeight: 900,
            fontSize: fontSize + 6,
            boxShadow: `0 4px 16px ${color(tooltip.cat)}22`,
            zIndex: 10,
          }}
        >
          <div style={{ color: color(tooltip.cat), fontWeight: 900, fontSize: fontSize + 6 }}>{tooltip.cat}</div>
          <div style={{ color: '#222', fontSize: fontSize + 2 }}>Value: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataSet, setSelectedDataSet] = useState<keyof typeof sampleDataSets>('monthly');
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [tooltip, setTooltip] = useState<{x: number, y: number, value: number, label: string} | null>(null);

  // Responsive resize
  useEffect(() => {
    function handleResize() {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        setDimensions({ width: Math.max(width, 350), height: 400 });
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSalesData(sampleDataSets[selectedDataSet]);
      setLoading(false);
    }, 500);
  }, [selectedDataSet]);

  useEffect(() => {
    if (!svgRef.current || salesData.length === 0) return;
    const { width, height } = dimensions;
    const margin = { top: 40, right: 30, bottom: 110, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // SVG and defs for gradient
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#42a5f5');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#66bb6a');

    // Main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(salesData.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.25);
    const y = d3.scaleLinear()
      .domain([0, d3.max(salesData, d => d.amount)! * 1.1])
      .range([innerHeight, 0]);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-35)')
      .style('text-anchor', 'end')
      .style('font-size', '24px')
      .style('fill', '#1976d2');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(7).tickFormat(d => `$${d3.format(",.0f")(d as number)}`))
      .selectAll('text')
      .style('font-size', '24px')
      .style('fill', '#388e3c');

    // Y axis label
    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -85)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', '#388e3c')
      .attr('font-size', '28px')
      .text('Sales ($)');

    // X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 80)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1976d2')
      .attr('font-size', '28px')
      .text('Period');

    // Bars with animation
    g.selectAll('rect')
      .data(salesData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.date) || 0)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 14)
      .on('mousemove', function(event, d) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setTooltip({ x: mx, y: my, value: d.amount, label: d.date });
        d3.select(this).attr('fill', '#ff7043');
      })
      .on('mouseleave', function() {
        setTooltip(null);
        d3.select(this).attr('fill', 'url(#bar-gradient)');
      })
      .transition()
      .duration(900)
      .attr('y', d => y(d.amount))
      .attr('height', d => innerHeight - y(d.amount));

    // Value labels
    g.selectAll('.value-label')
      .data(salesData)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.date) || 0) + x.bandwidth() * 0.75)
      .attr('y', d => y(d.amount) - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '22px')
      .attr('font-weight', 'bold')
      .text(d => `$${d.amount}`)
      .style('opacity', 0)
      .transition()
      .delay(900)
      .duration(500)
      .style('opacity', 1);
  }, [salesData, dimensions]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1 style={{ textAlign: 'center', fontWeight: 900, fontSize: 36, marginBottom: 24 }}>Admin Dashboard</h1>
      <div className="controls" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <select
          value={selectedDataSet}
          onChange={(e) => setSelectedDataSet(e.target.value as keyof typeof sampleDataSets)}
          className="data-selector"
          style={{ fontSize: 20, padding: '10px 24px', borderRadius: 8, boxShadow: '0 2px 8px #1976d222', border: '1.5px solid #1976d2' }}
        >
          <option value="monthly">Monthly Data</option>
          <option value="quarterly">Quarterly Data</option>
          <option value="yearly">Yearly Data</option>
          <option value="seasonal">Seasonal Data</option>
        </select>
      </div>
      <div className="sales-graph" ref={wrapperRef} style={{
        width: '100%',
        minWidth: 350,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
        borderRadius: 32,
        boxShadow: '0 8px 32px #1976d233, 0 3px 12px #4caf4c22',
        padding: 0,
        margin: '0 auto 3rem auto',
        maxWidth: 1200,
        position: 'relative',
        overflow: 'visible',
        minHeight: 500,
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: 24, fontSize: 38, fontWeight: 900, textAlign: 'center', letterSpacing: 1, textShadow: '0 2px 8px #1976d244' }}>Sales Overview</h2>
        <svg
          ref={svgRef}
          style={{ display: 'block', margin: '0 auto' }}
          width={1100}
          height={500}
          viewBox="0 0 1100 500"
          preserveAspectRatio="xMidYMid meet"
        ></svg>
        {tooltip && (
          <div
            className="d3-tooltip"
            style={{
              left: tooltip.x + 30,
              top: tooltip.y + 10,
              position: 'absolute',
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid #1976d2',
              borderRadius: 12,
              padding: '14px 22px',
              pointerEvents: 'none',
              color: '#222',
              fontWeight: 700,
              fontSize: 22,
              boxShadow: '0 4px 16px #1976d244',
              zIndex: 10,
            }}
          >
            <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 24 }}>{tooltip.label}</div>
            <div style={{ color: '#388e3c', fontSize: 22 }}>${tooltip.value}</div>
          </div>
        )}
      </div>
      <h2 style={{ color: '#1976d2', marginTop: 40, marginBottom: 10, textAlign: 'center', fontWeight: 900, fontSize: 32, letterSpacing: 1 }}>Category Trends (Ridgeline Chart)</h2>
      <div className="ridgeline-graph" style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto 2rem auto',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e3f2fd 100%)',
        borderRadius: 32,
        boxShadow: '0 8px 32px #ab47bc33, 0 3px 12px #2196f322',
        padding: '3rem 2rem 3.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
        position: 'relative',
      }}>
        <RidgelineChart />
      </div>
    </div>
  );
};

export default AdminDashboard; 