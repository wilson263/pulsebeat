import { MapPin, Mail, MessageCircle, Phone, Clock, Send, ExternalLink, Instagram, Twitter, Globe, Linkedin } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const WHATSAPP_NUMBER = "8639922432";
  const GMAIL_ADDRESS = "pulsebeatsupport@gmail.com";
  const OFFICE_EMAIL = "pulsebeatsupport@gmail.com";

  const contactCards = [
    {
      icon: <Mail className="h-6 w-6" />,
      label: "Email Support",
      value: GMAIL_ADDRESS,
      sub: "We reply within 24 hours",
      color: "#EA4335",
      glow: "rgba(234,67,53,0.25)",
      action: () => window.open(`mailto:${GMAIL_ADDRESS}`, "_blank"),
      buttonLabel: "Send Email",
      buttonIcon: <Send className="h-4 w-4" />,
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      label: "WhatsApp",
      value: "+91 8639922432",
      sub: "Chat with us instantly",
      color: "#25D366",
      glow: "rgba(37,211,102,0.25)",
      action: () =>
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20PulseBeat%20Support%2C%20I%20need%20help%20with...`,
          "_blank"
        ),
      buttonLabel: "Open WhatsApp",
      buttonIcon: <ExternalLink className="h-4 w-4" />,
    },
    {
      icon: <Phone className="h-6 w-6" />,
      label: "Phone",
      value: "+91 8639922432",
      sub: "Mon–Fri, 9 AM – 6 PM EST",
      color: "#00F0FF",
      glow: "rgba(0,240,255,0.25)",
      action: () => window.open("tel:+918639922432", "_blank"),
      buttonLabel: "Call Now",
      buttonIcon: <Phone className="h-4 w-4" />,
    },
  ];

  const socialChannels = [
    {
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
      value: "@pulsebeat",
      sub: "Follow for updates & tips",
      color: "#E1306C",
      glow: "rgba(225,48,108,0.2)",
      href: "https://instagram.com/pulsebeat",
      badge: "Follow us",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter / X",
      value: "@pulsebeat",
      sub: "News & announcements",
      color: "#1DA1F2",
      glow: "rgba(29,161,242,0.2)",
      href: "https://twitter.com/pulsebeat",
      badge: "Latest news",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Telegram",
      value: "@pulsebeatapp",
      sub: "Join our community channel",
      color: "#0088CC",
      glow: "rgba(0,136,204,0.2)",
      href: "https://t.me/pulsebeatapp",
      badge: "Community",
    },
    {
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>,
      label: "Discord",
      value: "PulseBeat",
      sub: "Chat with the community",
      color: "#5865F2",
      glow: "rgba(88,101,242,0.2)",
      href: "https://discord.gg/pulsebeat",
      badge: "Chat",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      value: "PulseBeat",
      sub: "Professional updates",
      color: "#0A66C2",
      glow: "rgba(10,102,194,0.2)",
      href: "https://linkedin.com/company/pulsebeat",
      badge: "Professional",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Website",
      value: "pulsebeat.app",
      sub: "Explore docs & features",
      color: "#B026FF",
      glow: "rgba(176,38,255,0.2)",
      href: "https://pulsebeat.app",
      badge: "Docs",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">

      {/* Page header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-widest">
          <MessageCircle className="h-3.5 w-3.5" />
          Get In Touch
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl">
          Have a question, feedback, or need support? Our team is here to help. Reach us through any of the channels below.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contactCards.map((card) => (
          <div
            key={card.label}
            className="glass-panel rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-200 group"
            style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px ${card.glow}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold"
              style={{ backgroundColor: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{card.label}</p>
              <p className="font-bold text-foreground text-lg leading-tight">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
            <button
              onClick={card.action}
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: card.color, color: "#000" }}
            >
              {card.buttonIcon}
              {card.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Social channels */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">Find us on Social Media</h2>
          <p className="text-muted-foreground text-sm mt-1">Follow us to stay updated with the latest features and news.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialChannels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:scale-[1.02] group cursor-pointer"
              style={{
                borderColor: `${ch.color}25`,
                backgroundColor: `${ch.color}08`,
                boxShadow: `0 4px 20px ${ch.glow}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${ch.color}20`, color: ch.color }}
              >
                {ch.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{ch.label}</p>
                  {ch.badge && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${ch.color}20`, color: ch.color }}
                    >
                      {ch.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono truncate" style={{ color: ch.color }}>{ch.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{ch.sub}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Office / location section */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Info column */}
          <div className="p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl">Our Office</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                PulseBeat Headquarters<br />
                <span className="text-foreground font-medium">350 Fifth Avenue, Suite 6402</span><br />
                New York, NY 10118<br />
                United States
              </p>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Business Hours</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monday – Friday: 9:00 AM – 6:00 PM (EST)<br />
                    Saturday: 10:00 AM – 2:00 PM (EST)<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">General Enquiries</p>
                  <a
                    href={`mailto:${OFFICE_EMAIL}`}
                    className="text-xs text-primary hover:underline mt-1 block"
                  >
                    {OFFICE_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative bg-black/40 flex items-center justify-center min-h-[240px] overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center animate-pulse">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">New York, NY</p>
                <p className="text-xs text-muted-foreground">PulseBeat HQ</p>
              </div>
              <a
                href="https://maps.google.com/?q=350+Fifth+Avenue+New+York+NY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                Open in Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Email Support", href: `mailto:${GMAIL_ADDRESS}`, color: "#EA4335" },
            { label: "WhatsApp Chat", href: `https://wa.me/${WHATSAPP_NUMBER}`, color: "#25D366" },
            { label: "Instagram", href: "https://instagram.com/pulsebeat", color: "#E1306C" },
            { label: "Twitter / X", href: "https://twitter.com/pulsebeat", color: "#1DA1F2" },
            { label: "Telegram", href: "https://t.me/pulsebeatapp", color: "#0088CC" },
            { label: "Report a Bug", href: `mailto:bugs@pulsebeat.app?subject=Bug%20Report`, color: "#FF9900" },
            { label: "Feature Request", href: `mailto:ideas@pulsebeat.app?subject=Feature%20Request`, color: "#B026FF" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105"
              style={{
                color: link.color,
                borderColor: `${link.color}30`,
                backgroundColor: `${link.color}10`,
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
