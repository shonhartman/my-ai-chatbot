import { motion } from 'framer-motion';
import Link from 'next/link';

import { Persona } from '@/lib/personas';
// import { MessageIcon, VercelIcon } from './icons';

interface OverviewProps {
  persona: Persona;
}

export const Overview = ({ persona }: OverviewProps) => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-bold">{persona.name}</h2>
          <p className="text-muted-foreground">{persona.description}</p>
        </div>
        <p>
          Start a conversation with {persona.name} by typing a message below.
        </p>
      </div>
    </motion.div>
  );
};
