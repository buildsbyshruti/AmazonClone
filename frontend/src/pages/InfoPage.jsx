import "../styles/InfoPage.css";

export default function InfoPage({ title, description }) {
  return (
    <main className="info-page container">
      <section className="info-card">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
}
