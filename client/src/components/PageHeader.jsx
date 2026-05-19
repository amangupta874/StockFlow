const PageHeader = ({ actions, eyebrow, title, subtitle }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>
      {eyebrow && <p className="label mb-2">{eyebrow}</p>}
      <h1 className="text-3xl font-black tracking-tight text-ink dark:text-white md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
