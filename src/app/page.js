import TopTrendsSection from '@/components/TopTrendsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <TopTrendsSection />
      </div>

      <Footer />
    </div>
  );
}