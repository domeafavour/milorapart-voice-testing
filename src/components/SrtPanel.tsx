import { copyText } from "#/lib/copyText";
import { downloadText } from "#/lib/downloadText";
import { Button, Panel, Readout, Textarea } from "./ui";

export function SrtPanel({ srt }: { srt: string }) {
  async function copySrt() {
    await copyText(srt);
  }

  function downloadSrt() {
    downloadText(srt, "lines.srt");
  }

  return (
    <Panel className="animate-rise flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <Readout className="uppercase tracking-[0.18em]">SRT output</Readout>
        <div className="flex gap-2">
          <Button type="button" onClick={copySrt}>
            Copy
          </Button>
          <Button type="button" onClick={downloadSrt}>
            Download .srt
          </Button>
        </div>
      </div>
      <Textarea
        readOnly
        value={srt}
        rows={10}
        className="font-mono leading-relaxed"
      />
    </Panel>
  );
}
