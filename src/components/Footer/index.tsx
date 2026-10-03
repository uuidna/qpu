import { CMSLink } from '@/components/CMSLink'
import { footerOf } from '@/app/_data'

/** The site footer: the Footer global's links and copyright line. */
export async function Footer() {
  const footer = await footerOf()
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground">
        <span>{footer.copyright}</span>
        <nav className="flex flex-wrap gap-4">
          {(footer.navItems ?? []).map(({ link, id }) => <CMSLink key={id} link={link} className="hover:text-foreground" />)}
        </nav>
      </div>
    </footer>
  )
}
