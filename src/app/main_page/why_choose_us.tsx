import react from "react";


const reasons = [
  {
    title: "Kurikulum Terstruktur",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    icon: (
      <img src="/img/icon/curriculum_icon.svg" alt="Kurikulum Terstruktur" />
    ),
  },
  {
    title: "Mentor Berpengalaman",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    icon: (
      <img src="/img/icon/mentor_icon.svg" alt="Mentor Berpengalaman" />
    ),
  },
  {
    title: "Sertifikat Resmi",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    icon: (
      <img src="/img/icon/sertificat_icon.svg" alt="Sertifikat Resmi" />
    ),
  },
  {
    title: "Komunikasi Aktif",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis",
    icon: (
      <img src="/img/icon/bubble_chat_icon.svg" alt="Komunikasi Aktif" />
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-us-section">
      <div className="why-us-container">
        <h2>Mengapa Memilih Kami?</h2>
        <p>Kami hadir untuk memberikan pengalaman yang terbaik dan berdampak positif bagi masa depan</p>

        <div className="why-us-grid">
          {reasons.map((item, index) => (
            <article className="why-us-card" key={index}>
              <div className="why-us-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}