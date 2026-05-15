export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(
    ua.toLowerCase()
  );
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /ipad|tablet|playbook|silk/i.test(ua.toLowerCase()) && !isMobile();
}

export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}
