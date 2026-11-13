import ChannelsSection from '@/components/home/ChannelsSection';
import HomeHero from '@/components/home/HomeHero';
import HowItWorks from '@/components/home/HowItWorks';
import NetworkNotice from '@/components/home/NetworkNotice';
import StatsBand from '@/components/home/StatsBand';
import type { View } from '@/types';

interface HomePageProps {
  onNavigate: (view: View) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <HomeHero onNavigate={onNavigate} />
      <StatsBand />
      <ChannelsSection />
      <HowItWorks />
      <NetworkNotice />
    </>
  );
}
