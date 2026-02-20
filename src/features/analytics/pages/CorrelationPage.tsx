import { useState } from 'react';
import { PatternGallery } from '../components/patterns/PatternGallery';
import { PatternDetail } from '../components/patterns/PatternDetail';
import { Pattern } from '../components/patterns/PatternData';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/shared/components/layout/MainLayout';

export default function CorrelationPage() {
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

    return (
        <MainLayout>
            <div className="h-full p-6 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!selectedPattern ? (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            <PatternGallery onSelectPattern={setSelectedPattern} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <PatternDetail
                                pattern={selectedPattern}
                                onClose={() => setSelectedPattern(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MainLayout>
    );
}
