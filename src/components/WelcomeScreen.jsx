import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const WelcomeScreen = ({ name, onComplete }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}
            onAnimationComplete={() => {
                // This will trigger after the exit animation if handled by parent
            }}
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                }}
                style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '1.5rem',
                    borderRadius: '50%',
                    marginBottom: '2rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
            >
                <GraduationCap size={60} color="white" />
            </motion.div>

            <div style={{ textAlign: 'center', overflow: 'hidden' }}>
                <motion.h1
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        letterSpacing: '-1px'
                    }}
                >
                    Welcome, {name}!
                </motion.h1>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                    style={{
                        fontSize: '1.2rem',
                        opacity: 0.9,
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}
                >
                    Exam Management System
                </motion.p>
            </div>

            {/* Decorative elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    zIndex: -1
                }}
            />
        </motion.div>
    );
};

export default WelcomeScreen;
