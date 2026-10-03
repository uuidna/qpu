/** Sets data-theme before the first paint, from the visitor's choice or the system's, so the page never flashes the
 *  other theme (payloadcms/website's InitTheme). */
export function InitTheme() {
  const script = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}})()`
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
