'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSession } from './SessionContext';

type Variant = {
  id: string;
  name: string;
  weight: number;
  metadata: any;
};

type Test = {
  id: string;
  name: string;
  ab_variants: Variant[];
};

type Assignment = {
  testId: string;
  variantId: string;
  variantName: string;
};

interface ABTestContextType {
  getVariant: (testName: string) => Variant | null;
  getFeatureValue: <T>(key: string, defaultValue: T) => T;
  isLoading: boolean;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [tests, setTests] = useState<Test[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({}); // testName -> Assignment
  const [config, setConfig] = useState<Record<string, any>>({}); // Flattened config from all assignments
  const [isLoading, setIsLoading] = useState(true);
  const { visitorId, sessionId } = useSession();
  const supabase = createClient();

  useEffect(() => {
    if (!visitorId) return;

    const initABTests = async () => {
      try {
        // 1. Fetch active tests and variants
        const { data: testsData, error: testsError } = await supabase
          .from('ab_tests')
          .select(`
            id,
            name,
            ab_variants (
              id,
              name,
              weight,
              metadata
            )
          `)
          .eq('status', 'active');

        if (testsError) throw testsError;
        if (!testsData) {
            setIsLoading(false);
            return;
        }

        const activeTests = testsData as any[]; 
        setTests(activeTests);

        // 2. Fetch existing assignments for this visitor
        const { data: existingAssignments, error: assignError } = await supabase
          .from('ab_assignments')
          .select('test_id, variant_id, ab_tests(name), ab_variants(name)')
          .eq('visitor_id', visitorId);

        if (assignError) throw assignError;

        const currentAssignments: Record<string, Assignment> = {};
        const assignedTestIds = new Set<string>();

        existingAssignments?.forEach((a: any) => {
            // Handle potential nulls if test/variant was deleted but assignment remains
            if (a.ab_tests?.name && a.ab_variants?.name) {
                currentAssignments[a.ab_tests.name] = {
                    testId: a.test_id,
                    variantId: a.variant_id,
                    variantName: a.ab_variants.name
                };
                assignedTestIds.add(a.test_id);
            }
        });

        // 3. Assign for new tests
        const newAssignments: any[] = [];
        
        activeTests.forEach(test => {
          if (!assignedTestIds.has(test.id)) {
            // Logic to pick variant
            const variants = test.ab_variants;
            if (!variants || variants.length === 0) return;

            const totalWeight = variants.reduce((sum: number, v: any) => sum + v.weight, 0);
            let random = Math.random() * totalWeight;
            let selectedVariant = variants[0];

            for (const variant of variants) {
              random -= variant.weight;
              if (random <= 0) {
                selectedVariant = variant;
                break;
              }
            }

            // Add to local state
            currentAssignments[test.name] = {
              testId: test.id,
              variantId: selectedVariant.id,
              variantName: selectedVariant.name
            };

            // Prepare for DB insert
            newAssignments.push({
              visitor_id: visitorId,
              test_id: test.id,
              variant_id: selectedVariant.id,
              session_id: sessionId
            });
          }
        });

        setAssignments(currentAssignments);

        // 3.5 Build Config Map
        const newConfig: Record<string, any> = {};
        Object.entries(currentAssignments).forEach(([testName, assignment]) => {
            const test = activeTests.find(t => t.id === assignment.testId);
            const variant = test?.ab_variants.find((v: any) => v.id === assignment.variantId);
            
            if (variant?.metadata) {
                Object.assign(newConfig, variant.metadata);
            }
        });
        setConfig(newConfig);

        // 4. Persist new assignments
        if (newAssignments.length > 0) {
          await supabase.from('ab_assignments').insert(newAssignments);
        }

      } catch (error) {
        console.error('Error initializing A/B tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initABTests();
  }, [visitorId, sessionId]);

  const getVariant = (testName: string) => {
    const assignment = assignments[testName];
    if (!assignment) return null;
    
    const test = tests.find(t => t.name === testName);
    return test?.ab_variants.find(v => v.id === assignment.variantId) || null;
  };

  const getFeatureValue = <T,>(key: string, defaultValue: T): T => {
    if (config[key] !== undefined) {
        return config[key] as T;
    }
    return defaultValue;
  };

  return (
    <ABTestContext.Provider value={{ getVariant, getFeatureValue, isLoading }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within a ABTestProvider');
  }
  return context;
}
