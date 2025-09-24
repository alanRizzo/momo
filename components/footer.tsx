import { Coffee, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-foreground text-background py-16">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-12 items-start">
					{/* Contact Info (izquierda) */}
					<div className="space-y-4">
						<h3 className="text-xl font-semibold mb-6">Contacto</h3>
						<div className="space-y-3">
							<div className="flex">
								<a
									href="https://instagram.com/momotostadores"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center space-x-3 text-background/80 hover:text-accent hover:translate-x-1 transition-all"
								>
									<Instagram className="h-5 w-5" />
									<span>/momotostadores</span>
								</a>
							</div>
							<div className="flex">
								<a
									href="https://share.google/lo3beSadoUONhddBD"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center space-x-3 text-background/80 hover:text-accent hover:translate-x-1 transition-all"
								>
									<MapPin className="h-5 w-5" />
									<span>Av. Castro Barros 95, Córdoba, Argentina</span>
								</a>
							</div>
							<div className="flex">
								<a
									href="tel:+5493517721264"
									className="inline-flex items-center space-x-3 text-background/80 hover:text-accent hover:translate-x-1 transition-all"
								>
									<Phone className="h-5 w-5" />
									<span>+549 351 7721264</span>
								</a>
							</div>
							<div className="flex">
								<a
									href="mailto:ventas@momotostadores.com"
									className="inline-flex items-center space-x-3 text-background/80 hover:text-accent hover:translate-x-1 transition-all"
								>
									<Mail className="h-5 w-5" />
									<span>ventas@momotostadores.com</span>
								</a>
							</div>
						</div>

						{/* Botón WhatsApp */}
						<a
							href="https://wa.me/5493517721264"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium mt-4 transition-colors"
						>
							<Phone className="h-4 w-4 mr-2" /> WhatsApp
						</a>
					</div>

					{/* Brand (derecha) */}
					<div className="md:text-right">
						<div className="flex md:justify-end items-center space-x-2 mb-3">
							<Coffee className="h-8 w-8 text-accent" />
							<span className="text-2xl font-bold">MOMO TOSTADORES</span>
						</div>
						<p className="text-background/60 md:text-right">
							Café de especialidad, tostado en Córdoba
						</p>
					</div>
				</div>

				{/* Separador decorativo */}
				<div className="mt-12 pt-8 text-center border-t border-gradient-to-r from-transparent via-background/30 to-transparent">
					<p className="text-background/60">
						© 2025 Momo Tostadores. Todos los derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
