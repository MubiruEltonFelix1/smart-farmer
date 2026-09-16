interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <section className="page-header" aria-labelledby="page-heading">
      <div className="container">
        <div className="page-header__inner">
          <span className="page-header__eyebrow">{eyebrow}</span>
          <h1 id="page-heading" className="page-header__title">{title}</h1>
          <p className="page-header__subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
