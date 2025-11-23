import React from 'react'
import { motion } from 'framer-motion'

export default function Loader({ text = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
            <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear',
                }}
            />
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">{text}</p>
        </div>
    )
}
