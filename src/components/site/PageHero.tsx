interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="px-6 md:px-12 pt-24 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-[1100px] mx-auto text-center">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
          {eyebrow}
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight font-normal text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-8 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed font-light">
            {description}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
