import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Toggles html.navbar-scrolled so custom.css can switch the navbar from
// transparent (over a page hero) to frosted glass once the page scrolls
function updateScrolled() {
  document.documentElement.classList.toggle('navbar-scrolled', window.scrollY > 8);
}

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();
}

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) {
    updateScrolled();
  }
}
