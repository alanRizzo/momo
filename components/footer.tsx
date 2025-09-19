import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coffee, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Coffee className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">MOMO TOSTADORES</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Instagram className="h-5 w-5 text-accent" />
                <span className="text-background/80">/momotostadores</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-background/80">Córdoba, Argentina</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-background/80">+549 351 7721264</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-background/80">ventas@momotostadores.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-background/80 mb-4 text-pretty">
              Recibe ofertas exclusivas y noticias sobre nuestros cafés.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Suscribirse</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">© 2025 Momo Tostadores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
