import { Link } from "wouter";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Al Mehandi" 
                className="w-10 h-10 rounded-full object-cover border border-primary/20"
              />
              <span className="font-display font-bold text-xl text-primary">Al Mehandi</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Premium organic henna cones and vibrant nail colors. Handcrafted with love and natural ingredients for the perfect dark stain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Shop Combos</Link></li>
              <li><Link href="/track" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Phone size={16} />
                </div>
                <span>+91 8136917338</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Mail size={16} />
                </div>
                <span>almehandi1@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Instagram size={16} />
                </div>
                <a href="https://instagram.com/al_mehandi_" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  @al_mehandi_
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Al Mehandi. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-muted-foreground">Organic</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Handmade</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Chemical Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
