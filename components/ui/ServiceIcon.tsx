import type { ServiceIcon as ServiceIconName } from "@/lib/content";
import {
  AdsIcon,
  AppIcon,
  BrandingIcon,
  SeoIcon,
  SocialIcon,
  WebIcon,
} from "./Icons";

const map = {
  branding: BrandingIcon,
  seo: SeoIcon,
  ads: AdsIcon,
  social: SocialIcon,
  web: WebIcon,
  app: AppIcon,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconName;
  className?: string;
}) {
  const Icon = map[name];
  return <Icon className={className} />;
}
