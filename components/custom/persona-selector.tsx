'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { personas } from '@/lib/personas';
import { cn } from '@/lib/utils';

import { CheckCirclFillIcon, ChevronDownIcon } from './icons';

export function PersonaSelector({
  selectedPersonaId,
  className,
  onPersonaChange,
}: {
  selectedPersonaId: string;
  onPersonaChange: (personaId: string) => void;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticPersonaId, setOptimisticPersonaId] = useOptimistic(selectedPersonaId);

  const selectedPersona = useMemo(
    () => personas.find((persona) => persona.id === optimisticPersonaId),
    [optimisticPersonaId]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedPersona?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onSelect={() => {
              setOpen(false);
              startTransition(() => {
                setOptimisticPersonaId(persona.id);
                onPersonaChange(persona.id);
              });
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={persona.id === optimisticPersonaId}
          >
            <div className="flex flex-col gap-1 items-start">
              {persona.name}
              {persona.description && (
                <div className="text-xs text-muted-foreground">
                  {persona.description}
                </div>
              )}
            </div>
            <div className="text-primary dark:text-primary-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCirclFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
