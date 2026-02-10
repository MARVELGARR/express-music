import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import { SearchResult } from '../hooks/useSearchResults'
import { Music, Disc3, List } from 'lucide-react-native'

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  onResultSelect?: (result: SearchResult) => void
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'song':
      return Music
    case 'artist':
      return Disc3
    case 'playlist':
      return List
    default:
      return Music
  }
}

export default function SearchResults({ results, loading, onResultSelect }: SearchResultsProps) {
  if (loading) {
    return (
      <View className='flex-1 justify-center items-center py-8'>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <ScrollView className='flex-1 px-4 mt-4'>
      {results.map((result) => {
        const Icon = getTypeIcon(result.type)
        return (
          <Pressable
            key={result.id}
            onPress={() => onResultSelect?.(result)}
            className='flex flex-row items-center py-3 border-b border-gray-200'
          >
            <View className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3'>
              <Icon size={20} className='text-primary' />
            </View>
            <View className='flex-1'>
              <Text className='text-sm font-medium'>{result.title}</Text>
              {result.description && (
                <Text className='text-xs text-gray-500'>{result.description}</Text>
              )}
            </View>
            <View className='px-2 py-1 bg-gray-100 rounded'>
              <Text className='text-xs capitalize'>{result.type}</Text>
            </View>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
