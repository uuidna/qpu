import Qpu.General.Prose.SiteVitepressConfig

/-! # Pages

Lean writes the pages of the site whose body is one component of the site's theme: the title is a sentence of the
prose, and the component computes the rest at build.

Run from the repository root: `lake env lean lean/tools/Pages.lean` (`lake run seed` runs it). -/

open Prose

/-- A page whose body is one component: its path under `site`, its title and the component's name. -/
def pages : List (String × String × String) :=
  [("vitepress.md", siteVitepressConfig_possibilities, "VitePressPossibilities")]

#eval show IO Unit from do
  for (path, title, component) in pages do
    IO.FS.writeFile ("site" / path) s!"---\ntitle: {title.quote}\ndescription: {siteVitepressConfig_possibilitiesSays.quote}\n---\n\n# {title}\n\n{siteVitepressConfig_possibilitiesSays}\n\n<{component} />\n"
  IO.println s!"{pages.length} page(s) written"
