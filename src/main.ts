import './style.css';
import mermaid from 'mermaid';

const mermaidInputElement: any =
    document.querySelector<HTMLDivElement>('#mermaidInput')!,
  mermaidChartElement = document.querySelector<HTMLDivElement>(
    '#mermaidChartContainer'
  )!,
  outputElement = document.querySelector<HTMLDivElement>('#output')!;

const graphDefinition = `
flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]
`;

mermaidInputElement.value = graphDefinition;
mermaidChartElement.innerHTML = graphDefinition;

mermaidInputElement.addEventListener('input', async (event: any) => {
  const value = event.target.value;

  setTimeout(async () => {
    await renderMermaidChart(value);
    await parseMermaidChart(value);
  }, 500);
});

/**
 * Re-renders the mermaid chart
 */
async function renderMermaidChart(graphDefinitionText: string): Promise<void> {
  mermaid.initialize({
    startOnLoad: false,
  });

  const renderResult = await mermaid.render(
    'mermaidChart',
    graphDefinitionText
  );

  if (!renderResult) {
    alert('Could not render mermaid chart');
  }

  console.log(renderResult);
  mermaidChartElement.innerHTML = renderResult.svg;
}

/**
 * Parse the mermaid chart
 *
 * @source https://github.com/amguerrero/mermaid-parser/blob/d440749842b94f657cf071fbbd599205b32a913c/src/index.ts#L37-L62
 */
async function parseMermaidChart(graphDefinitionText: string): Promise<void> {
  mermaid.initialize({
    startOnLoad: false,
  });

  console.log(graphDefinitionText);

  const diagram = await mermaid.mermaidAPI.getDiagramFromText(
      graphDefinitionText
    ),
    parser = (diagram.getParser() as any).yy;

  const outputParser = {
    title: parser.getDiagramTitle(),
    accTitle: parser.getAccTitle(),
    edges: parser.getEdges(),
    vertices: parser.getVertices(),
    tooltip: parser.getTooltip(),
    direction: parser.getDirection(),
    classes: parser.getClasses(),
    subGraphs: parser.getSubGraphs(),
  };

  outputElement.innerHTML = JSON.stringify(outputParser, null, 2);
}
