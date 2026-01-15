import { ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { platforms } from '../data/content';
import { trackPlatformClick } from '../lib/analytics';

export default function PlatformLinks() {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1) as keyof typeof Icons] as any;
    return Icon ? <Icon className="h-5 w-5 text-cyan-300" /> : null;
  };

  const handlePlatformClick = (platform: { name: string; url: string }) => {
    trackPlatformClick(platform.name, platform.url);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Jetzt anhören</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handlePlatformClick(platform)}
            className="group relative flex items-center gap-3 rounded-xl border border-cyan-400/25 bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] hover:border-cyan-400/60 transition-colors"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/30 group-hover:ring-cyan-300/60 transition">
              {getIcon(platform.icon)}
            </div>
            <div className="min-w-0">
              <div className="text-white/95 font-medium text-sm">{platform.name}</div>
              <div className="text-xs text-slate-400">{platform.description}</div>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-cyan-300 opacity-80 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
}
