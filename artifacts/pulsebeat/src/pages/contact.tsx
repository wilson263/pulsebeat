import { MapPin, Mail, MessageCircle, Phone, Clock, Send, ExternalLink } from "lucide-react";
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
      action: () => window.open("tel:+18007857328", "_blank"),
      buttonLabel: "Call Now",
      buttonIcon: <Phone className="h-4 w-4" />,
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

          {/* Map placeholder / decorative panel */}
          <div className="relative bg-black/40 flex items-center justify-center min-h-[240px] overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            />
            {/* Center pin */}
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

      {/* Social / quick links */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Email Support", href: `mailto:${GMAIL_ADDRESS}`, color: "#EA4335" },
            { label: "WhatsApp Chat", href: `https://wa.me/${WHATSAPP_NUMBER}`, color: "#25D366" },
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
