import { motion } from "framer-motion";
import { Bed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Apartment } from "@/lib/localStorage";

interface Props {
  apartment: Apartment;
  index: number;
  onBook?: () => void;
}

const ApartmentCard = ({ apartment, index, onBook }: Props) => {
  const statusColors: Record<string, string> = {
    available: "bg-success/10 text-success border-success/20",
    occupied: "bg-muted text-muted-foreground border-border",
    maintenance: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card-lift rounded-xl overflow-hidden bg-card border border-border"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={apartment.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
          alt={apartment.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge className={`absolute top-3 right-3 ${statusColors[apartment.status]} border`}>
          {apartment.status}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">{apartment.name}</h3>
        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
          <MapPin className="w-3.5 h-3.5" /> {apartment.address}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{apartment.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${apartment.price.toLocaleString()}</span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Bed className="w-4 h-4" /> {apartment.bedrooms}
            </span>
            {apartment.status === "available" && (
              <Button size="sm" className="btn-glow" onClick={onBook}>
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApartmentCard;
