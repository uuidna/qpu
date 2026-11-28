import Qpu.General.Prose.SiteVitepressConfig

/-! # Pages

Lean writes the pages of the site whose body is one component of the site's theme: the title is a sentence of the
prose, and the component computes the rest at build.

Run from the repository root: `lake env lean lean/tools/Pages.lean` (`lake run seed` runs it). -/

open Prose

/-- A page whose body is one component: its path under `site`, title, description, optional layout and component name. -/
def pages : List (String × String × String × Option String × String) :=
  [ ("vitepress.md", siteVitepressConfig_possibilities, siteVitepressConfig_possibilitiesSays, none, "VitePressPossibilities")
  , ("studio.md", siteVitepressConfig_studio, siteVitepressConfig_studioSays, some "page", "PayloadQuantumStudio") ]

#eval show IO Unit from do
  for (path, title, description, layout, component) in pages do
    let text := match layout with
      | some l =>
        s!"---\ntitle: {title.quote}\ndescription: {description.quote}\nlayout: {l}\n---\n\n<{component} />\n"
      | none =>
        s!"---\ntitle: {title.quote}\ndescription: {description.quote}\n---\n\n# {title}\n\n{description}\n\n<{component} />\n"
    IO.FS.writeFile ("site" / path) text
  IO.println s!"{pages.length} page(s) written"
