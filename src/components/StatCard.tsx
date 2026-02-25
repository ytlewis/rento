import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import CountUpNumber from "./CountUpNumber";

interface Props {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  index: number;
  accent?: boolean;
}

const StatCard = ({ title, value, prefix, suffix, icon: Icon, index, accent }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`rounded-xl p-6 border ${accent ? "gradient-primary text-primary-foreground border-transparent" : "bg-card border-border"}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ? "bg-primary-foreground/20" : "bg-primary/10"}`}>
        <Icon className={`w-5 h-5 ${accent ? "text-primary-foreground" : "text-primary"}`} />
      </div>
    </div>
    <p className={`text-sm font-medium mb-1 ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{title}</p>
    <p className="text-3xl font-bold">
      <CountUpNumber end={value} prefix={prefix} suffix={suffix} />
    </p>
  </motion.div>
);

export default StatCard;
