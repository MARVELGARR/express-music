



import { TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { cn } from '@/lib/utils'

const Backbutton = ({ className }: { className?: string }) => {

    const router = useRouter()

    const handleBack = () => {
        router.back()
    }
    return (
        <TouchableOpacity className={cn(className, "")} onPress={handleBack}>
            <ChevronLeft size={30} />
        </TouchableOpacity>
    )
}

export default Backbutton