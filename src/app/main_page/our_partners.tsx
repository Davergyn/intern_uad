import React from "react";

const partners = [
  {
    key: "main",
    img: "/img/partners/partners_logo.svg",
    sub: "",
  },
];

export default function OurPartners() {
  return (
    <section className="partners-section">
      <div className="partners-container">
        <h2>Our Partners</h2>
        <p>DIPERCAYA OLEH MITRA KAMI</p>

        <div className="partners-row partners-row-single">
          {partners.map((partner) => (
            <article className="partner-item" key={partner.key}>
              <div className={"partner-logo partner-" + partner.key}>
                <img src={partner.img} alt="Partners logo" className="partner-logo-main" />
                {partner.sub ? <span className="partner-logo-sub">{partner.sub}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}