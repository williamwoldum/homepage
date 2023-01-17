import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { widget } = service;

  const { data: printerStats, error: printerStatsError } = useWidgetAPI(widget, "printer_stats", {
    refreshInterval: 1500,
  });
  const { data: jobStats, error: jobStatsError } = useWidgetAPI(widget, "job_stats", {
    refreshInterval: 1500,
  });

  if (printerStatsError) {
    return <Container error={printerStatsError} />;
  }

  if (jobStatsError) {
    return <Container error={jobStatsError} />;
  }

  const state = printerStats?.state?.text;
  const tempTool = printerStats?.temperature?.tool0?.actual;
  const tempBed = printerStats?.temperature?.bed?.actual;

  if (!printerStats || !state || !tempTool || !tempBed) {
    return (
      <Container service={service}>
        <Block label="octoPrint.printer_state" />
      </Container>
    );
  }

  if (state === "Printing" || state === "Paused") {
    const { completion } = jobStats.progress;

    if (!jobStats || !completion) {
      return (
        <Container service={service}>
          <Block label="octoPrint.printer_state" />
          <Block label="octoPrint.temp_tool" />
          <Block label="octoPrint.temp_bed" />
          <Block label="octoPrint.job_completion" />
        </Container>
      );
    }

    return (
      <Container service={service}>
        <Block label="octoPrint.printer_state" value={printerStats.state.text} />
        <Block label="octoPrint.temp_tool" value={`${printerStats.temperature.tool0.actual}°`} />
        <Block label="octoPrint.temp_bed" value={`${printerStats.temperature.bed.actual}°`} />
        <Block label="octoPrint.job_completion" value={`${completion.toFixed(2)}%`} />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="octoPrint.printer_state" value={printerStats.state.text} />
      <Block label="octoPrint.temp_tool" value={`${printerStats.temperature.tool0.actual}°`} />
      <Block label="octoPrint.temp_bed" value={`${printerStats.temperature.bed.actual}°`} />
    </Container>
  );
}
