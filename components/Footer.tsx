import { SOCIAL, MAILING_ADDRESS } from '@/lib/env';

export default function Footer() {
  return (
    <footer className="bg-ink py-12 text-sky-soft">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <span className="font-display text-xl font-bold text-white">
              CharterWith<span className="text-sky">Liam</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-mist">
              Private jet charter, booked direct. Handled by our team, start to
              finish.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-6 text-sm"
          >
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
            <div className="flex items-center gap-4">
              <SocialLink href={SOCIAL.instagram} label="Instagram">
                IG
              </SocialLink>
              <SocialLink href={SOCIAL.tiktok} label="TikTok">
                TT
              </SocialLink>
              <SocialLink href={SOCIAL.youtube} label="YouTube">
                YT
              </SocialLink>
              <SocialLink href={SOCIAL.linkedin} label="LinkedIn">
                in
              </SocialLink>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-mist">
          <p>{MAILING_ADDRESS}</p>
          <p className="mt-1">© 2026 CharterWithLiam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white transition-colors hover:border-sky hover:bg-sky"
    >
      {children}
    </a>
  );
}
