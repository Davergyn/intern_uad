import ProgramDetail from "../_components/program-detail";

export default function SeminarPage() {
  return (
    <ProgramDetail
      slug="seminar"
      fallbackTitle="Seminar"
      fallbackDescription="Program Seminar .id Academy adalah kegiatan edukasi terbuka untuk meningkatkan wawasan masyarakat mengenai teknologi digital, identitas digital, keamanan siber, dan pemanfaatan nama domain .id."
      fallbackBenefits={[
        "Memperluas literasi digital.",
        "Memahami pentingnya kedaulatan dan keamanan identitas digital.",
        "Menguasai konsep dasar teknologi dan inovasi digital.",
        "Memanfaatkan domain .id sebagai identitas digital yang terpercaya.",
      ]}
    />
  );
}
