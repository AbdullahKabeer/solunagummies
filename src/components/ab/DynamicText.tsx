'use client';

import { useABTest } from '@/context/ABTestContext';
import { ReactNode } from 'react';

interface DynamicTextProps {
  id: string;
  defaultContent: string;
  className?: string;
}

export function DynamicText({ id, defaultContent, className }: DynamicTextProps) {
  const { getFeatureValue, isLoading } = useABTest();
  const text = getFeatureValue(id, defaultContent);

  // Optional: Add a loading state or skeleton if critical, 
  // but for text replacement, usually instant or default is fine.
  // To avoid layout shift, we render defaultText immediately if loading, 
  // or we could render nothing. Rendering default is safer for SEO/UX.
  
  return <span className={className}>{text}</span>;
}
