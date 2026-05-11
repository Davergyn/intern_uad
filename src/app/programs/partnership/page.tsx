import ProgramDetail from "../_components/program-detail";

export default function PartnershipPage() {
  return (
    <ProgramDetail
      slug="partnership"
      fallbackTitle="Partnership"
      fallbackDescription="Program Partnership .id Academy membuka kolaborasi dengan institusi, komunitas, kampus, dan organisasi untuk memperluas dampak literasi digital Indonesia."
      fallbackBenefits={[
        "Membangun program edukasi digital bersama PANDI.",
        "Memperluas akses pembelajaran untuk komunitas dan institusi.",
        "Menghadirkan narasumber dan materi yang relevan.",
        "Menguatkan ekosistem digital Indonesia yang inklusif.",
      ]}
    />
  );
}
