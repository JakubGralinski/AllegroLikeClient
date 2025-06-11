import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './AdminDashboard.css';
import { useQuery } from '@tanstack/react-query';
import {
    fetchSalesData,
    fetchCategoryTrendData,
    RidgelineCategoryData,
} from '../lib/api';
import { Container } from '@mui/material';

// Export SalesData if it's primarily used here and imported by api.ts
// If api.ts defines its own SalesData based on DTO, that's also fine.
export interface SalesData {
    date: string;
    amount: number;
}

interface RidgelineChartProps {
    data: RidgelineCategoryData[] | undefined;
    isLoading: boolean;
    error: Error | null;
}

// Default empty state for charts when data is loading or not available
const initialSalesData: SalesData[] = [];
const initialRidgelineData: RidgelineCategoryData[] = [];

const RidgelineChart: React.FC<RidgelineChartProps> = ({ data, isLoading, error }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [highlighted, setHighlighted] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ cat: string, x: number, y: number, value: number } | null>(null);
    const width = 700;
    const height = 350;
    const margin = { top: 90, right: 50, bottom: 70, left: 120 };
    const fontSize = 14;
    const legendFontSize = 22;
    const labelFontSize = 16;

    useEffect(() => {
        if (!svgRef.current || !data || data.length === 0) {
            if (svgRef.current) d3.select(svgRef.current).selectAll('*').remove(); // Clear previous chart
            return;
        }

        const bandCount = data.length;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const bandSpacing = innerHeight / (bandCount > 1 ? bandCount - 1 : 1); // Avoid division by zero if only one band
        const yGlobalMax = d3.max(data.flatMap(cat => cat.values), d => d.y) || 50; // Calculate max y from data, default 50
        const yGlobal = d3.scaleLinear().domain([0, yGlobalMax]).range([innerHeight, 0]);
        
        const color = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.category))
            .range(d3.schemeCategory10); // Using a standard D3 color scheme

        d3.select(svgRef.current).selectAll('*').remove();

        const xDomainMax = d3.max(data.flatMap(cat => cat.values), d => d.x) || 10;
        const x = d3.scaleLinear().domain([d3.min(data.flatMap(cat => cat.values), d => d.x) || 1, xDomainMax]).range([0, innerWidth]);

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(yGlobal).ticks(5).tickSize(-innerWidth).tickFormat('' as any))
            .selectAll('line')
            .attr('stroke', '#e0e0e0');

        data.forEach((cat, i) => {
            const offset = i * bandSpacing;
            const gradId = `ridgeline-gradient-${cat.category.replace(/\s+/g, '-')}`;
            const defs = svg.append('defs');
            const grad = defs.append('linearGradient')
                .attr('id', gradId)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');
            grad.append('stop').attr('offset', '0%').attr('stop-color', color(cat.category) as string).attr('stop-opacity', 0.35);
            grad.append('stop').attr('offset', '100%').attr('stop-color', color(cat.category) as string).attr('stop-opacity', 0.10);

            const areaPath = d3.area<{ x: number, y: number }>()
                .x(d_1 => x(d_1.x))
                .y0(_ => yGlobal(0) - offset)
                .y1(d_1 => yGlobal(d_1.y) - offset)
                .curve(d3.curveBasis);
            svg.append('path')
                .datum(cat.values)
                .attr('fill', `url(#${gradId})`)
                .attr('opacity', highlighted && highlighted !== cat.category ? 0.12 : 0.35)
                .attr('stroke', 'none')
                .attr('d', areaPath)
                .attr('transform', `translate(${margin.left},${margin.top})`)
                .on('mousemove', function (event, _) {
                    const [mx, my] = d3.pointer(event, svgRef.current);
                    const xm = x.invert(mx - margin.left);
                    const closest = cat.values.reduce((a, b) => Math.abs(b.x - xm) < Math.abs(a.x - xm) ? b : a);
                    setTooltip({ cat: cat.category, x: mx, y: my, value: closest.y });
                })
                .on('mouseleave', () => setTooltip(null));

            const line = d3.line<{ x: number, y: number }>()
                .x(d_1 => x(d_1.x))
                .y(d_1 => yGlobal(d_1.y) - offset)
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
                .attr('x', margin.left - 25)
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

        svg.append('g')
            .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(Math.min(10, xDomainMax)))
            .selectAll('text')
            .style('font-size', fontSize)
            .style('font-weight', 400);

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(yGlobal).ticks(5))
            .selectAll('text')
            .style('font-size', fontSize)
            .style('font-weight', 400);
    }, [data, highlighted, height, width, margin, fontSize, labelFontSize]); 

    const legend = data && data.length > 0 && (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            marginBottom: 10,
            fontSize: legendFontSize,
            fontWeight: 400,
            letterSpacing: 0.5,
        }}>
            {data.map(cat => (
                <span key={cat.category} style={{
                    color: d3.scaleOrdinal<string>().domain(data.map(d_1 => d_1.category)).range(d3.schemeCategory10)(cat.category),
                    fontWeight: 400,
                    fontSize: legendFontSize,
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

    if (isLoading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Category Trends...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error loading category trends: {error.message}</div>;
    if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No category trend data available.</div>;

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 0, position: 'relative' }}>
            {legend}
            <svg ref={svgRef} style={{ width: '100%', maxWidth: 700, height: 350, display: 'block', margin: '0 auto', borderRadius: 24 }}></svg>
            {tooltip && (
                <div
                    className="d3-tooltip"
                    style={{
                        left: tooltip.x + 30,
                        top: tooltip.y + 10,
                        position: 'absolute',
                        background: 'rgba(255,255,255,0.97)',
                        border: `2px solid ${d3.scaleOrdinal<string>().domain(data.map(d_1 => d_1.category)).range(d3.schemeCategory10)(tooltip.cat)}`,
                        borderRadius: 12,
                        padding: '14px 22px',
                        pointerEvents: 'none',
                        color: d3.scaleOrdinal<string>().domain(data.map(d_1 => d_1.category)).range(d3.schemeCategory10)(tooltip.cat),
                        fontWeight: 900,
                        fontSize: (fontSize || 14) + 6,
                        zIndex: 10,
                    }}
                >
                    <div style={{ color: d3.scaleOrdinal<string>().domain(data.map(d_1 => d_1.category)).range(d3.schemeCategory10)(tooltip.cat), fontWeight: 900, fontSize: (fontSize || 14) + 6 }}>{tooltip.cat}</div>
                    <div style={{ color: '#222', fontSize: (fontSize || 14) + 2 }}>Value: {tooltip.value}</div>
                </div>
            )}
        </div>
    );
};

const periodOptions = [
    { value: 'monthly', label: 'Monthly Data' },
    { value: 'quarterly', label: 'Quarterly Data' },
    { value: 'yearly', label: 'Yearly Data' },
    { value: 'seasonal', label: 'Seasonal Data' },
];

const AdminDashboard: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedDataSet, setSelectedDataSet] = useState<string>(periodOptions[0].value); 
    const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
    const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, label: string } | null>(null);

    const { data: salesData, isLoading: isLoadingSales, error: salesError } = useQuery<SalesData[], Error>({
        queryKey: ['salesData', selectedDataSet],
        queryFn: () => fetchSalesData(selectedDataSet),
        placeholderData: initialSalesData, 
    });

    const { data: categoryTrendData, isLoading: isLoadingTrends, error: trendsError } = useQuery<RidgelineCategoryData[], Error>({
        queryKey: ['categoryTrendData'],
        queryFn: fetchCategoryTrendData,
        placeholderData: initialRidgelineData,
    });

    useEffect(() => {
        function handleResize() {
            if (wrapperRef.current) {
                const width = wrapperRef.current.offsetWidth;
                setDimensions({ width: Math.max(width, 350), height: 500 });
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!svgRef.current || !salesData || salesData.length === 0) {
            if (svgRef.current) d3.select(svgRef.current).selectAll('*').remove();
            return;
        }
        const { width, height } = dimensions;
        const margin = { top: 40, right: 30, bottom: 110, left: 120 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'bar-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '0%').attr('y2', '100%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#42a5f5');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#66bb6a');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(salesData.map(d => d.date))
            .range([0, innerWidth])
            .padding(0.25);
        const yMax = d3.max(salesData, d => d.amount) || 0;
        const y = d3.scaleLinear()
            .domain([0, yMax * 1.1])
            .range([innerHeight, 0]);

        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-35)')
            .style('text-anchor', 'end')
            .style('font-size', '14px') 
            .style('fill', '#1976d2');

        g.append('g')
            .call(d3.axisLeft(y).ticks(7).tickFormat(d_1 => `$${d3.format(",.0f")(d_1 as number)}`))
            .selectAll('text')
            .style('font-size', '14px') 
            .style('fill', '#388e3c');

        g.append('text')
            .attr('x', -innerHeight / 2)
            .attr('y', -85)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('fill', '#388e3c')
            .attr('font-size', '18px') 
            .text('Sales ($)');

        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 80)
            .attr('text-anchor', 'middle')
            .attr('fill', '#1976d2')
            .attr('font-size', '18px') 
            .text('Period');

        g.selectAll('.bar') 
            .data(salesData)
            .enter()
            .append('rect')
            .attr('class', 'bar') 
            .attr('x', d => x(d.date) || 0)
            .attr('y', innerHeight)
            .attr('width', x.bandwidth())
            .attr('height', 0)
            .attr('fill', 'url(#bar-gradient)')
            .attr('rx', 14)
            .on('mousemove', function (event, d) {
                const [mx, my] = d3.pointer(event, svgRef.current);
                setTooltip({ x: mx, y: my, value: d.amount, label: d.date });
                d3.select(this).attr('fill', '#ff7043');
            })
            .on('mouseleave', function () {
                setTooltip(null);
                d3.select(this).attr('fill', 'url(#bar-gradient)');
            })
            .transition()
            .duration(900)
            .attr('y', d => y(d.amount))
            .attr('height', d => innerHeight - y(d.amount));

        g.selectAll('.value-label')
            .data(salesData)
            .enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => (x(d.date) || 0) + x.bandwidth() / 2) 
            .attr('y', d => y(d.amount) - 10) 
            .attr('text-anchor', 'middle')
            .attr('fill', '#333')
            .attr('font-size', '12px') 
            .attr('font-weight', 'bold')
            .text(d => `$${d.amount}`)
            .style('opacity', 0)
            .transition()
            .delay(900)
            .duration(500)
            .style('opacity', 1);
    }, [salesData, dimensions]);

    return (
        <Container
            maxWidth="lg"
            sx={{ mt: 4, mb: 4, ml: { sm: '240px' } }}
            className="flex flex-col"
        >
            <h1 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2.5rem', marginBottom: '2rem' }}>
                Admin Dashboard
            </h1>

            <div style={{ marginBottom: '2rem' }}>
                <select
                    value={selectedDataSet}
                    onChange={(e) => setSelectedDataSet(e.target.value)}
                    style={{
                        padding: '12px 20px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    {periodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div ref={wrapperRef} className="chart-container" style={{ position: 'relative', width: '100%', maxWidth: '800px', background: 'linear-gradient(145deg, #e6e6e6, #ffffff)', borderRadius: '24px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
                    Sales Overview
                </h2>
                {isLoadingSales && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading sales data...</div>}
                {salesError && <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {salesError.message}</div>}
                {!isLoadingSales && !salesError && salesData && salesData.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>No sales data available for this period.</div>
                )}
                <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
                {tooltip && (
                    <div
                        className="d3-tooltip"
                        style={{
                            position: 'absolute',
                            left: tooltip.x,
                            top: tooltip.y,
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            pointerEvents: 'none',
                            fontSize: '16px',
                        }}
                    >
                        <div>Date: {tooltip.label}</div>
                        <div>Sales: ${tooltip.value.toLocaleString()}</div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', width: '100%', maxWidth: '800px', background: 'linear-gradient(145deg, #e6e6e6, #ffffff)', borderRadius: '24px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
                    Category Popularity Trends
                </h2>
                <RidgelineChart data={categoryTrendData} isLoading={isLoadingTrends} error={trendsError} />
            </div>
        </Container>
    );
};

export default AdminDashboard;