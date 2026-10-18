import { CemrePage, cemreMetadata } from '@/components/cemre/CemrePage';
export const metadata = cemreMetadata('en');
export default function Page() { return <CemrePage locale="en" />; }
