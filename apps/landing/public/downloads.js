(() => {
  const REPO = "soumyachk101/OrbitCode-Release";
  const RELEASES_PAGE = `https://github.com/${REPO}/releases`;
  const LATEST_DOWNLOAD = `${RELEASES_PAGE}/latest/download/`;
  const MAC_DIRECT = `${LATEST_DOWNLOAD}Orbit.dmg`;

  const ua = navigator.userAgent || "";
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua) || navigator.userAgentData?.mobile
    || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
  const os = mobile ? null : /Win/i.test(platform) ? "windows"
    : /Mac/i.test(platform) ? "macos" : /Linux/i.test(platform)
    ? (/aarch64|arm64/i.test(`${platform} ${ua}`) ? "linux-arm" : "linux") : null;

  const applyLinks = (info) => {
    const { version, macUrl, winUrl, linuxUrl, linuxArmUrl } = info;

    // Platform-specific links in the downloads section
    const macLink = document.querySelector('[data-platform-download="macos"]');
    if (macLink) {
      macLink.href = macUrl || MAC_DIRECT;
      macLink.textContent = "Download";
    }

    const winLink = document.querySelector('[data-platform-download="windows"]');
    if (winLink) {
      if (winUrl) {
        winLink.href = winUrl;
        winLink.textContent = "Download";
        const meta = winLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "x64 · executable (.exe)";
      } else {
        winLink.href = RELEASES_PAGE;
        winLink.textContent = "Releases ↗";
        const meta = winLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "x64 · Coming soon";
      }
    }

    const linuxLink = document.querySelector('[data-platform-download="linux"]');
    if (linuxLink) {
      if (linuxUrl) {
        linuxLink.href = linuxUrl;
        linuxLink.textContent = "Download";
        const meta = linuxLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "x64 · tar.gz";
      } else {
        linuxLink.href = RELEASES_PAGE;
        linuxLink.textContent = "Releases ↗";
        const meta = linuxLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "x64 · Coming soon";
      }
    }

    const linuxArmLink = document.querySelector('[data-platform-download="linux-arm"]');
    if (linuxArmLink) {
      if (linuxArmUrl) {
        linuxArmLink.href = linuxArmUrl;
        linuxArmLink.textContent = "Download";
        const meta = linuxArmLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "arm64 · tar.gz";
      } else {
        linuxArmLink.href = RELEASES_PAGE;
        linuxArmLink.textContent = "Releases ↗";
        const meta = linuxArmLink.parentElement?.querySelector(".dl-meta");
        if (meta) meta.textContent = "arm64 · Coming soon";
      }
    }

    // Hero, nav, and closing CTA buttons
    let mainHref = "#downloads";
    let mainLabel = "Download";
    let mainDetail = "Desktop app";

    if (os === "macos") {
      mainHref = macUrl || MAC_DIRECT;
      mainLabel = "Download for macOS";
      mainDetail = "Apple silicon · dmg";
    } else if (os === "windows") {
      if (winUrl) {
        mainHref = winUrl;
        mainLabel = "Download for Windows";
        mainDetail = "Windows x64 (.exe)";
      } else {
        mainHref = "#downloads";
        mainLabel = "Download Orbit";
        mainDetail = "macOS available · Windows soon";
      }
    } else if (os === "linux" || os === "linux-arm") {
      const lUrl = os === "linux-arm" ? linuxArmUrl : linuxUrl;
      if (lUrl) {
        mainHref = lUrl;
        mainLabel = "Download for Linux";
        mainDetail = os === "linux-arm" ? "Linux ARM64" : "Linux x64";
      } else {
        mainHref = "#downloads";
        mainLabel = "Download Orbit";
        mainDetail = "macOS available · Linux soon";
      }
    }

    const nav = document.getElementById("nav-download");
    if (nav) {
      nav.href = mainHref;
      nav.textContent = "Download";
    }

    const hero = document.getElementById("hero-download");
    if (hero) {
      hero.href = mainHref;
      hero.textContent = mainLabel;
      hero.setAttribute("aria-label", `${mainLabel} (${mainDetail})`);
      hero.title = mainDetail;
    }

    const closing = document.getElementById("closing-download");
    if (closing) {
      closing.href = mainHref;
      closing.textContent = mainLabel;
      closing.setAttribute("aria-label", `${mainLabel} (${mainDetail})`);
      closing.title = mainDetail;
    }

    const verEl = document.getElementById("ver");
    if (verEl && version) {
      verEl.textContent = version.startsWith("v") ? version : `v${version}`;
    }
  };

  // Safe fallback immediately so all buttons work without network latency
  applyLinks({
    version: "1.1.1",
    macUrl: MAC_DIRECT,
    winUrl: null,
    linuxUrl: null,
    linuxArmUrl: null,
  });

  // Query GitHub API for the latest release and its published assets
  fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { credentials: "omit" })
    .then((r) => r.ok ? r.json() : Promise.reject())
    .then((release) => {
      if (!release || !Array.isArray(release.assets)) return;
      const tag = release.tag_name || "1.1.1";
      const assets = release.assets;

      // Find platform assets from the actual release
      const macAsset = assets.find((a) => a.name === "Orbit.dmg")
        || assets.find((a) => a.name.toLowerCase().endsWith(".dmg"));
      const winAsset = assets.find((a) => a.name.toLowerCase().endsWith(".exe"))
        || assets.find((a) => a.name.toLowerCase().includes("windows") && a.name.toLowerCase().endsWith(".zip"));
      const linuxAsset = assets.find((a) => a.name.toLowerCase().includes("linux-x86_64") || (a.name.toLowerCase().includes("linux") && !a.name.toLowerCase().includes("aarch64") && !a.name.toLowerCase().includes("arm")));
      const linuxArmAsset = assets.find((a) => a.name.toLowerCase().includes("linux-aarch64") || a.name.toLowerCase().includes("linux-arm64"));

      applyLinks({
        version: tag,
        macUrl: macAsset ? macAsset.browser_download_url : MAC_DIRECT,
        winUrl: winAsset ? winAsset.browser_download_url : null,
        linuxUrl: linuxAsset ? linuxAsset.browser_download_url : null,
        linuxArmUrl: linuxArmAsset ? linuxArmAsset.browser_download_url : null,
      });
    })
    .catch(() => {});
})();
