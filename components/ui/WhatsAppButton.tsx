import { profile } from "@/lib/content";
import { Icon } from "./Primitives";
import s from "./whatsapp.module.css";

/**
 * Floating WhatsApp button.
 *
 * Rendered by the two public pages rather than the root layout, so it never
 * appears over the back office — where a "message me" button pointing at the
 * operator's own number would be nonsense.
 *
 * The label is hidden until hover on desktop and always hidden on mobile, so
 * the button stays out of the way of the content it floats over.
 */
export function WhatsAppButton() {
  return (
    <a
      className={s.fab}
      href={`https://wa.me/${profile.whatsappHref}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Message ${profile.firstName} on WhatsApp at ${profile.whatsapp}`}
    >
      <Icon name="whatsapp" size={26} />
      <span className={s.label}>WhatsApp</span>
    </a>
  );
}
