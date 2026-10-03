import Link from 'next/link'
import { CMSLink } from '@/components/CMSLink'
import { ThemeSelector } from '@/components/ThemeSelector'
import { headerOf } from '@/app/_data'

/** The site header: its navigation is the Header global, edited in the admin. */
export async function Header() {
  const header = await headerOf()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          uuidna<span className="text-primary">/qpu</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {(header.navItems ?? []).map(({ link, id }) => (
            <CMSLink key={id} link={link} className="rounded-md px-3 py-1.5 whitespace-nowrap text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
          ))}
        </nav>
        <ThemeSelector />
      </div>
    </header>
  )
}
