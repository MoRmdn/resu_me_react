import { Marquee } from "@/components/motion/Marquee";
import { marqueeItems } from "@/content/skills";

export function TechStrip() {
  return (
    <div className="border-y border-line bg-ink-800">
      <Marquee items={marqueeItems} className="h-[54px] items-center py-4" />
    </div>
  );
}
